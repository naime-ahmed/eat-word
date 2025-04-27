import Milestone from "../../models/Milestone.js";
import Word from "../../models/Word.js";

const updateWord = async (req, res) => {
  try {
    // Extract user ID, word Id and milestone ID
    const userId = req.user.id;
    const wordId = req.params.wordId;
    const { milestoneId, updates } = req.body;

    // Validate inputs
    if (!milestoneId || !wordId) {
      return res
        .status(400)
        .json({ message: "Milestone ID and Word ID are required." });
    }

    if (
      !updates ||
      typeof updates !== "object" ||
      Object.keys(updates).length === 0
    ) {
      return res.status(400).json({ message: "Updates object is required." });
    }

    // Find the word and update it
    const word = await Word.findOneAndUpdate(
      { _id: wordId, addedBy: userId, addedMilestone: milestoneId },
      { $set: updates },
      { new: true } // Return the updated document
    );

    if ("memorized" in updates) {
      const increment = updates.memorized ? 1 : -1;

      await Milestone.findOneAndUpdate(
        { _id: milestoneId },
        { $inc: { memorizedCount: increment } }
      );
    }

    // If the word is not found
    if (!word) {
      return res
        .status(404)
        .json({ message: "Word not found or unauthorized action." });
    }

    // Return success response
    res.status(200).json({ message: "Word updated successfully.", word });
  } catch (error) {
    console.error("Error updating word:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the word." });
  }
};

export { updateWord };
