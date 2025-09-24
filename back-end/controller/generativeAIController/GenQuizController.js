import { Type } from "@google/genai";
import mongoose from "mongoose";
import { callModel } from "../../helper/GoogleGenAI.js";
import Milestones from "../../models/Milestone.js";
import Quiz from "../../models/Quiz.js";
import Word from "../../models/Word.js";

function buildQuizPrompt(comfortableLang, learningLang, quizCount, words) {
  const wordList = words
    .map((word) => {
      const meaning = word.meanings || "";
      const synonyms = word.synonyms || "";
      const definitions = word.definitions || "";
      return `- Word: "${word.word}"\n  Meanings (${comfortableLang}): ${meaning}\n  Synonyms (${learningLang}): ${synonyms}\n  Definitions (${learningLang}): ${definitions}`;
    })
    .join("\n\n");

  return `
You are an expert linguistics professor and professional assessment designer specializing in vocabulary learning.
Your task is to generate a high-quality vocabulary quiz set for language learners.  

You will be given a list of vocabulary words along with their information:  
- Word (in the learning language)
- Meanings (in the ${comfortableLang})  
- Synonyms (in the ${learningLang}, if available)  
- Definitions (in the ${learningLang}, if available)  

Languages:  
- Comfortable language: ${comfortableLang}  
- Learning language: ${learningLang}  

Number of quizzes required: ${quizCount}  

Guidelines for quiz generation:  
1. Generate exactly ${quizCount} quizzes.  
2. Distribute 100 marks between ${quizCount} quizzes based on  their complexity.
3. Question types must be only from this set:  
   - Multiple-choice (MCQ)
   - Matching (word → meaning/synonym)
   - True/False (about word usage/definition)
4. Each quiz must test knowledge in one of these aspects:  
   - Correct meaning recognition (${comfortableLang})  
   - Identifying synonyms (${learningLang})  
   - Understanding definitions (${learningLang})  
   - Applying the word in a new contextual sentence (${learningLang})  
5. Avoid repeating given meanings/definitions verbatim in the question text; use them intelligently to test understanding.
6. All example sentences must be freshly written, natural, and concise.  
7. Do not include commentary, markdown, or extra text outside the required JSON.  

Vocabulary list to use for quiz creation:  
${wordList}

Output Requirements:  
- Return a JSON array with exactly ${quizCount} objects.
- Follow the schema provided strictly.  
- Ensure the JSON is valid and self-contained.  
`.trim();
}

function buildResponseSchema() {
  return {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        quizType: {
          type: Type.STRING,
          enum: ["multiple_choice", "matching", "true_false"],
        },
        instruction: { type: Type.STRING },
        question: { type: Type.STRING },
        options: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: { type: Type.STRING },
              isCorrect: { type: Type.BOOLEAN },
            },
            required: ["id", "text", "isCorrect"],
          },
        },
        answer: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            explanation: { type: Type.STRING },
          },
          required: ["text", "explanation"],
        },
        wordsTested: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        difficulty: {
          type: Type.STRING,
          enum: ["easy", "medium", "hard"],
        },
        marks: { type: Type.NUMBER },
        metadata: {
          type: Type.OBJECT,
          properties: {
            questionFocus: {
              type: Type.STRING,
              enum: ["meaning", "synonym", "definition", "contextual_usage"],
            },
            estimatedTimeSec: { type: Type.NUMBER },
          },
          required: ["questionFocus", "estimatedTimeSec"],
        },
      },
      required: [
        "id",
        "quizType",
        "instruction",
        "question",
        "options",
        "answer",
        "wordsTested",
        "difficulty",
        "metadata",
      ],
    },
  };
}

/**
 * Controller: Generate quizzes for a milestone
 */
async function generateMilestoneQuiz(req, res) {
  try {
    const { milestoneId } = req.params;
    const { quizCount } = req.body;
    const { id: userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(milestoneId)) {
      return res.status(400).json({ message: "Invalid milestone ID format." });
    }
    if (!quizCount || typeof quizCount !== "number" || quizCount <= 0) {
      return res
        .status(400)
        .json({ message: "quizCount must be a positive number." });
    }

    // Fetch milestone
    const milestone = await Milestones.findOne({
      _id: milestoneId,
      addedBy: userId,
    });
    if (!milestone) {
      return res
        .status(404)
        .json({ message: "Milestone not found or not authorized." });
    }

    // Fetch words
    const words = await Word.find({
      addedMilestone: milestoneId,
      addedBy: userId,
    });
    if (!words || words.length === 0) {
      return res.status(404).json({
        message: "No words found for this milestone to create quizzes.",
      });
    }

    const comfortableLang = milestone.comfortableLang || "English";
    const learningLang = milestone.learningLang || "English";

    // Build prompt
    const prompt = buildQuizPrompt(
      comfortableLang,
      learningLang,
      quizCount,
      words
    );

    // call LLM and parse json
    let quizzes;
    try {
      const aiResponse = await callModel(
        "gemini-2.0-flash",
        process.env.GEMINI_API_KEY,
        prompt,
        "application/json",
        buildResponseSchema()
      );
      if (!aiResponse) {
        throw new Error("AI failed to generate quizzes.");
      }

      try {
        quizzes = JSON.parse(aiResponse);
      } catch (parseErr) {
        console.error("Failed to parse AI response:", aiResponse);
        throw new Error("AI returned invalid JSON.");
      }
    } catch (err) {
      console.error("AI failed to generate quizzes:", err);
      return res
        .status(500)
        .json({ message: "AI failed to generate quizzes." });
    }

    // Save the generated quiz to the database
    const newQuiz = new Quiz({
      userId: userId,
      milestoneId: milestoneId,
      questions: quizzes,
    });

    const savedQuiz = await newQuiz.save();

    res.status(201).json({
      message: "Quizzes generated and saved successfully.",
      quiz: savedQuiz,
    });
  } catch (error) {
    console.error("Error in generateMilestoneQuiz:", error);
    res.status(500).json({
      message:
        error.message ||
        "An unexpected error occurred while generating quizzes.",
    });
  }
}

export { generateMilestoneQuiz };
