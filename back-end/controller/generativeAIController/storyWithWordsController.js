import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";
import Milestones from "../../models/Milestone.js";
import User from "../../models/People.js";
import Word from "../../models/Word.js";

function buildStoryPrompt(typeOfStory, learningLang, maxStorySize, words) {
  const vocabularyList = words
    .map((word) => {
      const meaning = word.meanings || word.definitions || "a useful word";
      return `- word: "${word.word}" (meaning: ${meaning})`;
    })
    .join("\n");

  return `
You are a creative writer specializing in educational stories for language learners.
Your task is to write a simple, engaging ${typeOfStory} story in ${learningLang}. The story is for a beginner (A1/A2 level), so you must use very simple grammar and sentence structures.

The story must naturally use the following vocabulary words. When you use one of these vocabulary words, you MUST highlight the entire word with single backticks, including any grammatical variations (e.g., verb conjugations, plural forms) of the word.

Formatting Rules:
- Use clean Markdown for structure.
- Provide a title using a single hashtag (e.g., # The Lost Key).
- Use double hashtags for chapters (e.g., ## Chapter name).
- MUST highlight words from vocabulary with backticks not asterisks or anything.
- Keep paragraphs engaging and easy to read.
- The entire story must be under ${maxStorySize} words. Don't be cheap though.
- DO NOT use any emojis, icons, blockquotes, or other complex styling.

Vocabulary to include:
${vocabularyList}

Begin the story directly with the title. Do not include any preamble, commentary, or explanation before or after the story.
  `.trim();
}

/**
 * Main controller to generate a story for a milestone.
 */
async function generateMilestoneStory(req, res) {
  try {
    const { milestoneId } = req.params;
    const { typeOfStory, maxStorySize } = req.body;
    const { id: userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(milestoneId)) {
      return res.status(400).json({ message: "Invalid milestone ID format." });
    }

    // 1. Fetch data from the database
    const milestone = await Milestones.findOne({
      _id: milestoneId,
      addedBy: userId,
    });
    if (!milestone) {
      return res
        .status(404)
        .json({ message: "Milestone not found or you're not authorized." });
    }

    const user = await User.findById(userId, "subscriptionType"); // Fetch only necessary fields
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 2. Business Logic: Check generation limits
    const isRegularUser = user.subscriptionType === "regular";
    const hasGeneratedBefore = milestone.story && milestone.story.length > 0;
    const hasReachedMaxGenerations = milestone.storyCount >= 100;

    if ((isRegularUser && hasGeneratedBefore) || hasReachedMaxGenerations) {
      return res
        .status(403)
        .json({
          message:
            "You have reached your story generation limit for this milestone.",
        });
    }

    const words = await Word.find({
      addedMilestone: milestoneId,
      addedBy: userId,
    });
    if (!words || words.length === 0) {
      return res
        .status(404)
        .json({
          message: "No words found for this milestone to create a story.",
        });
    }

    // 3. Build the prompt and call the AI
    const learningLang = milestone.learningLang || "English";
    const prompt = buildStoryPrompt(
      typeOfStory,
      learningLang,
      maxStorySize,
      words
    );

    // generate with gemini
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "text/plain",
      },
    }).catch((e) => {
      console.log("generation error: ",e);
      throw new Error("AI failed to generate a story. The response was empty.");
    })

    // 4. Update the database with the new story
    const updatedMilestone = await Milestones.findByIdAndUpdate(
      milestoneId,
      {
        $set: { story: response.text },
        $inc: { storyCount: 1 },
      },
      { new: true, runValidators: true }
    );

    // 5. Send the successful response
    res.status(200).json({
      message: "Milestone story generated successfully.",
      story: updatedMilestone.story,
      storyCount: updatedMilestone.storyCount,
    });
  } catch (error) {
    console.error("Error in generateMilestoneStory:", error);
    res.status(500).json({
      message:
        error.message ||
        "An unexpected error occurred while generating the story.",
    });
  }
}

export { generateMilestoneStory };
