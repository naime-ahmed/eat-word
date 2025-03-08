// external imports
import mongoose from "mongoose";

// internal imports
import Milestones from "../../models/Milestone.js";
import Word from "../../models/Word.js";

/*
Note: If the milestone deletion succeeds but the word deletion fails, there will be orphan words left in database, Handle this on production with mongodb "Transaction".
*/

// remove associated words while deleting the milestone
async function deleteMilestone(req, res) {
  try {
    const milestoneId = req.params.milestoneId;
    const userId = req.user.id;

    // Check if milestoneId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(milestoneId)) {
      return res.status(400).json({ message: "Invalid Milestone ID" });
    }

    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    // Find the Milestone by id and user id (addedBy) and delete
    const deletedMilestone = await Milestones.findOneAndDelete({
      _id: milestoneId,
      addedBy: userId,
    });

    if (!deletedMilestone) {
      return res
        .status(404)
        .json({ message: "Milestone not found or unauthorized" });
    }

    // If milestone deletion succeeds, delete all associated words
    const wordsDeleteResult = await Word.deleteMany({
      addedBy: userId,
      addedMilestone: milestoneId,
    });

    // Send success response
    res.status(200).json({
      message: "Milestone and associated words deleted successfully",
      deletedMilestone,
      wordsDeleted: wordsDeleteResult.deletedCount,
    });
  } catch (error) {
    // Log the error for further investigation
    console.error("Error during Milestone deletion:", error);

    // Send a generic error message to the client
    res.status(500).json({
      message: "An unknown error occurred during Milestone deletion",
    });
  }
}

export { deleteMilestone };
