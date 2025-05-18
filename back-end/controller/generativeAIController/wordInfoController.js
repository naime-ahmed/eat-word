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
    `Give EXACTLY ONE concise definition (<25 words) for each sense of “${word}” in ${lang}.  
  — If it has noun, verb, and/or adjective senses, label and separate them as:  
    (noun) Definition. | (verb) Definition. | (adj) Definition.  
  — Do NOT list more than one definition per PoS.  
  Output only that line in plain text.`,

  examples: (word, lang, existingDefinitions) => {
    if (existingDefinitions) {
      return `Based on these exact definitions: ${existingDefinitions.trim()}  
  Write EXACTLY ONE example sentence (<25 words) per sense of “${word}” in ${lang}, matching only that definition.  
  — If multiple PoS, label as:  
  (noun) Sentence. | (verb) Sentence. | (adj) Sentence.  
  Output only that line in plain text.`;
    }
    return `Write EXACTLY ONE example sentence (<25 words) in ${lang} illustrating each essential sense of “${word}”.  
  — If it has distinct noun, verb, or adjective senses, label as:  
  (noun) Sentence. | (verb) Sentence. | (adj) Sentence.  
  Output only that line in plain text.`;
  },
};

// Process individual field
async function generateField(field, word, lang, existingDefinitions) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  const prompt =
    field !== "examples"
      ? FIELD_PROMPTS[field](word, lang)
      : FIELD_PROMPTS[field](word, lang, existingDefinitions);

  const result = await model.generateContent(prompt);
  return processFieldResponse(field, result.response.text());
}

// Retry wrapper
async function generateFieldWithRetry(field, word, lang, existingDefinitions, retries = 3) {
  let lastError;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await generateField(field, word, lang, existingDefinitions);
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  throw lastError;
}

// Clean and enforce length limits
function processFieldResponse(field, text) {
  const cleaned = text.replace(/["\.]/g, "").trim();
  const maxLength = wordFieldsAndLimit()[field];

  switch (field) {
    case "meanings":
    case "synonyms": {
      const items = cleaned.split(",").map((s) => s.trim()).filter(Boolean).slice(0, field === 'meanings' ? 4 : 3);
      return items.join(", ").slice(0, maxLength);
    }
    case "definitions":
    case "examples":
      return cleaned.replace(/,/g, "").slice(0, maxLength);
    default:
      return cleaned.slice(0, maxLength);
  }
}

// Preferred field order
const PREFERRED_ORDER = ["meanings", "synonyms", "definitions", "examples"];

export async function generateWordInfo(req, res) {
  try {
    const { wordId } = req.params;
    let { fields, comfortableLang, learningLang } = req.body;

    if (!Array.isArray(fields)) {
      return res.status(400).json({ message: "Invalid fields format" });
    }

    const word = await Word.findById(wordId);
    if (!word) {
      return res.status(404).json({ message: "Word not found" });
    }

    // Reorder fields according to preference, skipping missing
    fields = PREFERRED_ORDER.filter((f) => fields.includes(f));

    const updateData = {};
    let defData = word.definitions || null;

    // Generate sequentially to ensure definitions exist before examples
    for (const field of fields) {
      const lang = field === "meanings" ? comfortableLang : learningLang;
      const existingDefinitions = field === "examples" ? defData : undefined;

      try {
        const value = await generateFieldWithRetry(field, word.word, lang, existingDefinitions);
        updateData[field] = value;

        if (field === "definitions") {
          defData = value;
        }
      } catch (error) {
        console.error(`Failed to generate ${field}:`, error);
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(500).json({ message: "Failed to generate any fields" });
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
    return res.status(500).json({ message: error?.message || "Failed to update word info" });
  }
}
