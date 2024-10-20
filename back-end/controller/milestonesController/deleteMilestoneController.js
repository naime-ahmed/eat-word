// external imports
import mongoose from "mongoose";

// internal imports
import Milestones from "../../models/Milestone.js";

async function deleteMilestone(req, res, next) {
  try {
    const milestoneId = req.params.milestoneId;
    const userId = req.user.id;

    // Check if milestoneId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(milestoneId)) {
      return res.status(400).json({ message: "Invalid Milestone ID" });
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

    // Send success response
    res.status(200).json({ message: "Milestone deleted successfully" });
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
