import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";
import Milestones from "../../models/Milestone.js";
import Word from "../../models/Word.js";

async function generateMilestoneStory(req, res) {
  try {
    const { milestoneId } = req.params;
    const { typeOfStory, maxStorySize } = req.body;
    const userId = req.user.id;

    // Validate milestoneId format
    if (!mongoose.Types.ObjectId.isValid(milestoneId)) {
      return res.status(400).json({ message: "Invalid milestone ID format" });
    }

    // Retrieve the milestone to get the learning language and ensure authorization
    const milestone = await Milestones.findOne({ _id: milestoneId, addedBy: userId });
    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found or unauthorized" });
    }

    if(milestone.storyCount >= 100){
      return res.status(400).json({ message: "You've reached the story generating limit!" });
    }

    const learningLang = milestone.learningLang || "English";

    // Retrieve words associated with the milestone and user
    const words = await Word.find({ 
      addedMilestone: milestoneId, 
      addedBy: userId 
    });
    
    if (!words || words.length === 0) {
      return res.status(404).json({ message: "No words found for this milestone" });
    }

    // Construct a prompt for the AI
    const prompt = `
    Generate a ${typeOfStory} story in ${learningLang} that helps memorize the following vocabulary.
    Use simple language so the story is easily understood. Structure the story into clear, engaging chapters, each slightly expanded based on the story genre, but ensure the entire story does not exceed ${maxStorySize} words.
    Incorporate each word into the narrative naturally, including its meanings, synonyms, definitions, and examples where provided.
    Return only the story text in plain text format. Each chapter should be clearly labeled (e.g., "Chapter 1:", "Chapter 2:"), with chapters separated by newline characters. Do not include any additional commentary or metadata.
    Vocabulary:
    ${words
      .map((word) => {
        let parts = [`Word: "${word.word}"`];
        if (word.meanings) parts.push(`Meaning: "${word.meanings}"`);
        if (word.synonyms) parts.push(`Synonyms: "${word.synonyms}"`);
        if (word.definitions) parts.push(`Definition: "${word.definitions}"`);
        if (word.examples) parts.push(`Example: "${word.examples}"`);
        return parts.join(" | ");
      })
      .join("\n")}
    `;

    // Initialize the AI client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    // Generate the story using the AI model
    const result = await model.generateContent(prompt);
    const story = result.response.text();

    // Update the milestone's story and increment storyCount
    const updatedMilestone = await Milestones.findOneAndUpdate(
      { _id: milestoneId, addedBy: userId },
      { 
        $set: { story },
        $inc: { storyCount: 1 }
      },
      { new: true, runValidators: true }
    );

    if (!updatedMilestone) {
      return res.status(404).json({ message: "Milestone not found or unauthorized" });
    }

    // Return the story and the updated count
    res.status(200).json({
      message: "Milestone story generated successfully",
      story: updatedMilestone.story,
      storyCount: updatedMilestone.storyCount,
    });
  } catch (error) {
    console.error("Error generating milestone story:", error);
    res.status(500).json({
      message: error.message || "Failed to generate milestone story",
    });
  }
}

export { generateMilestoneStory };
