import { GoogleGenerativeAI } from "@google/generative-ai";
import Word from "../../models/Word.js";
import { wordFieldsAndLimit } from "../../utils/wordFieldsAndLimit.js";

// Field-specific prompt templates
const FIELD_PROMPTS = {
  meanings: (word, lang) =>
    `Provide up to 4 comma-separated meanings in ${lang} for "${word}". Output only the meanings without extra commentary. If the word has distinct multiple meanings, ensure they are clearly differentiated.`,

  synonyms: (word, lang) =>
    `List up to 3 comma-separated synonyms in ${lang} for "${word}". Output only the synonyms without additional commentary.`,

  definitions: (word, lang) =>
    `Provide ONE concise ${lang} definition for "${word}" (<25 words). If the word has TWO MEANINGS THAT: 
    1) Are completely unrelated semantically
    2) Appear in basic vocabulary
    3) Would fundamentally impair comprehension if not separated
    THEN provide both meanings separated by " | ". Never split nuanced variations. Example: financial institution | river edge. Output ONLY the text.`,
  examples: (word, lang, existingDefinitions) => {
    const basePrompt = `Create ONE ${lang} example for "${word}" (<25 words). ONLY if the word has TWO UNRELATED MEANINGS ESSENTIAL FOR BASIC USAGE, provide examples for both separated by " | ".`;

    if (existingDefinitions) {
      const definitionsList = existingDefinitions
        .split("|")
        .map((d) => d.trim());
      return `${basePrompt} Base your examples on these EXACT definitions: ${definitionsList.join(
        " | "
      )}. Output ONLY the text.`;
    }

    return `${basePrompt} Ensure examples:
        1) Match definition contexts exactly
        2) Use different subject matter
        3) Couldn't work with other meaning
        Example: "I deposited money at the bank | We picnicked by the river bank". Output ONLY the text.`;
  },
};

// Process individual field
async function generateField(field, word, lang, existingDefinitions) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    let prompt = undefined;
    if(field !== "examples"){
      prompt = FIELD_PROMPTS[field](
        word,
        lang
      );
    }else{
      prompt = FIELD_PROMPTS[field](
        word,
        lang,
        existingDefinitions || undefined
      );
    }

    const result = await model.generateContent(prompt);
    return processFieldResponse(field, result.response.text());
  } catch (error) {
    console.error(`Failed to generate ${field}:`, error);
    return null;
  }
}

// retry mechanism with exponential backoff
async function generateFieldWithRetry(field, word, lang,additionalData, retries = 3) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await generateField(field, word, lang, additionalData);
    } catch (error) {
      attempt++;
      if (attempt >= retries) throw error;
      await new Promise((res) => setTimeout(res, 1000 * attempt));
    }
  }
}

// Validate and format field responses
function processFieldResponse(field, text) {
  const cleaned = text.replace(/["\.]/g, "").trim();
  const maxLength = wordFieldsAndLimit()[field];

  switch (field) {
    case "meanings":
    case "synonyms":
      const items = cleaned
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .slice(0, 3);

      const joined = items.join(", ");
      return joined.substring(0, Math.min(joined.length, maxLength));

    case "definitions":
    case "examples":
      return cleaned.replace(/,/g, "").substring(0, maxLength);

    default:
      return cleaned.substring(0, maxLength);
  }
}

export async function generateWordInfo(req, res) {
  try {
    const { wordId } = req.params;
    const { fields, comfortableLang, learningLang } = req.body;

    // Validate input
    if (!Array.isArray(fields)) {
      return res.status(400).json({ message: "Invalid fields format" });
    }

    const word = await Word.findById(wordId);
    if (!word) {
      return res.status(404).json({ message: "Word not found" });
    }

    // Generate fields with retries and error tracking
    const generationResults = await Promise.allSettled(
      fields.map((field) => {
        const lang = field === "meanings" ? comfortableLang : learningLang;
        const additionalData =
          field === "examples" ? word.definitions : undefined;

        return generateFieldWithRetry(field, word.word, lang, additionalData);
      })
    );

    const updateData = {};
    generationResults.forEach((result, index) => {
      const field = fields[index];
      if (result.status === "fulfilled" && result.value) {
        updateData[field] = result.value;
      } else {
        console.error(`Failed to generate ${field}:`, result.reason);
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(500).json({ message: "Failed to generate all fields" });
    }

    const updatedWord = await Word.findByIdAndUpdate(
      wordId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Word updated successfully",
      updateData,
      milestoneId: updatedWord.addedMilestone,
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      message: error?.message || "Failed to update some word information",
    });
  }
}
