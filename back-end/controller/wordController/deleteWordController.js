import Milestone from "../../models/Milestone.js";
import Word from "../../models/Word.js";

const deleteWord = async (req, res) => {
  let milestone;
  try {
    // Extract user ID, word Id and milestone ID
    const userId = req.user.id;
    const wordId = req.params.wordId;
    const { milestoneId } = req.body;

    // Validate inputs
    if (!milestoneId || !wordId) {
      return res
        .status(400)
        .json({ message: "Milestone ID and Word ID are required." });
    }

    // Find the milestone
    milestone = await Milestone.findOne({ _id: milestoneId });
    if (!milestone) {
      return res
        .status(404)
        .json({ message: "No associated milestone was found!" });
    }

    // Update word count in milestone
    await Milestone.updateOne(
      { _id: milestoneId },
      { $inc: { wordsCount: -1 } }
    );

    // Find and delete the word
    const word = await Word.findOneAndDelete({
      _id: wordId,
      addedBy: userId,
      addedMilestone: milestoneId,
    });

    // If the word is not found
    if (!word) {
      return res
        .status(404)
        .json({ message: "Word not found or unauthorized action." });
    }

    // Return success response
    res.status(200).json({ message: "Word deleted successfully." });
  } catch (error) {
    console.error("Error deleting word:", error);
    // Rollback: Decrement wordsCount if the word save failed
    if (milestone) {
      await Milestone.updateOne(
        { _id: milestone._id },
        { $inc: { wordsCount: 1 } }
      );
    }
    res
      .status(500)
      .json({ message: "An error occurred while deleting the word." });
  }
};

export { deleteWord };
