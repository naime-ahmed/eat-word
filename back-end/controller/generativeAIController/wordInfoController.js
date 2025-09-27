import { Type } from "@google/genai";
import { callModel } from "../../helper/GoogleGenAI.js";
import Word from "../../models/Word.js";
import { wordFieldsAndLimit } from "../../utils/wordFieldsAndLimit.js";

// === FIELD CONFIGURATION ===
const FIELD_CONFIG = {
  meanings: { limit: 4, separator: ", ", jsonKey: "meanings" },
  synonyms: { limit: 3, separator: ", ", jsonKey: "synonyms" },
  definitions: { limit: 3, separator: " | ", jsonKey: "definitions" },
  examples: { limit: 3, separator: " | ", jsonKey: "examples" },
};

const PREFERRED_ORDER = ["meanings", "synonyms", "definitions", "examples"];

// === SCHEMA BUILDER ===
function buildResponseSchema(fields) {
  const properties = {};
  for (const field of fields) {
    properties[FIELD_CONFIG[field].jsonKey] = {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
    };
  }

  return {
    type: Type.OBJECT,
    properties,
    required: PREFERRED_ORDER.filter((f) => fields.includes(f)),
  };
}

// === PROMPT BUILDER ===
function buildPrompt(
  fields,
  word,
  comfortableLang,
  learningLang,
  existingDefinitions
) {
  return `
You are a precise vocabulary data generator.

Requirements:
${
  fields.includes("meanings")
    ? `- Provide up to ${FIELD_CONFIG["meanings"].limit} most relevant and concise ${comfortableLang} meanings for the word.`
    : ""
}
${
  fields.includes("synonyms")
    ? `- Provide up to ${FIELD_CONFIG["synonyms"].limit} most relevant ${learningLang} synonyms for the word.`
    : ""
}
${
  fields.includes("definitions")
    ? `- Provide up to ${FIELD_CONFIG["definitions"].limit} most relevant ${learningLang} definitions for the word. Each under 25 words.`
    : ""
}
${
  existingDefinitions
    ? `Use ONLY these exact definitions for examples: ${existingDefinitions}`
    : ""
}
${
  fields.includes("examples")
    ? `- Provide up to ${FIELD_CONFIG["examples"].limit} most relevant ${learningLang} examples for the word. Each under 25 words.`
    : ""
}

Rules:
- No commentary or markdown in your response.
- Keep the text for each item concise and plain.

Target word: "${word}"
- If the word is misspelled, generate info for the most relevant correct spelling.
`.trim();
}

// === SANITIZATION ===
function sanitizeText(text) {
  return text.replace(/^[\d\.\-\)\s]+/, "").trim();
}

function processFieldArray(field, arr) {
  if (!Array.isArray(arr)) return "";

  const cfg = FIELD_CONFIG[field];
  const cleaned = arr
    .map((item) => sanitizeText(String(item)))
    .filter(Boolean)
    .slice(0, cfg.limit);

  return cleaned.join(cfg.separator).slice(0, wordFieldsAndLimit()[field]);
}

function parseAndProcessResponse(raw, fields) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error("Invalid JSON from AI:", raw);
    return {};
  }

  const result = {};
  for (const field of fields) {
    const arr = Array.isArray(parsed[field]) ? parsed[field] : [];
    result[field] = processFieldArray(field, arr);
  }
  return result;
}

// === MAIN AI CALL ===
async function generateAllFields(
  fields,
  word,
  comfortableLang,
  learningLang,
  existingDefinitions
) {
  const prompt = buildPrompt(
    fields,
    word,
    comfortableLang,
    learningLang,
    existingDefinitions
  );

  const schema = buildResponseSchema(fields);

  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const raw = await callModel(
        "gemini-2.0-flash-lite",
        process.env.GEMINI_API_KEY,
        prompt,
        "application/json",
        schema
      );
      if (!raw) {
        console.error("Empty AI response");
        return {};
      }

      const processed = parseAndProcessResponse(raw, fields);

      if (Object.values(processed).some((v) => v)) {
        return processed;
      }
      throw new Error("AI returned empty or invalid data");
    } catch (err) {
      lastError = err;
      console.warn(`AI request failed (attempt ${attempt + 1}):`, err.message);
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  throw lastError;
}

// === CONTROLLER ===
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

    let existingDefinitions = word.definitions || null;
    if (fields.includes("definitions") && fields.includes("examples")) {
      existingDefinitions = null;
    }

    const updateData = await generateAllFields(
      fields,
      word.word,
      comfortableLang,
      learningLang,
      existingDefinitions
    );

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
    return res.status(500).json({
      message: error?.message || "Failed to update word info",
    });
  }
}
