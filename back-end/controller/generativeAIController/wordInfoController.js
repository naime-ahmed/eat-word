import { GoogleGenerativeAI } from "@google/generative-ai";
import Word from "../../models/Word.js";
import { wordFieldsAndLimit } from "../../utils/wordFieldsAndLimit.js";

// Field-specific prompt templates
const FIELD_PROMPTS = {
  meanings: (word, lang) =>
    `Provide exactly 3 or less comma-separated meanings in ${lang} for "${word}". Example: "meaning1, meaning2". No explanations.`,

  synonyms: (word, lang) =>
    `List exactly 3 or less comma-separated synonyms in ${lang} for "${word}". Example: "syn1, syn2, syn3". No explanations.`,

  definitions: (word, lang) =>
    `Give one short definition in ${lang} for "${word}" (under 15 words). No explanations.`,

  examples: (word, lang) =>
    `Create one usage example in ${lang} for "${word}" (under 20 words). No explanations.`,
};

// Process individual field
async function generateField(field, word, lang) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const prompt = FIELD_PROMPTS[field](word, lang);
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return processFieldResponse(field, text);
  } catch (error) {
    console.error(`Failed to generate ${field}:`, error);
    return null;
  }
}

// retry mechanism with exponential backoff
async function generateFieldWithRetry(field, word, lang, retries = 3) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await generateField(field, word, lang);
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
      fields.map((field) =>
        generateFieldWithRetry(
          field,
          word.word,
          field === "meanings" ? comfortableLang : learningLang
        )
      )
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
