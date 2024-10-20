// external imports
import mongoose from "mongoose";

// internal imports
import Milestones from "../../models/Milestone.js";

async function updateMilestone(req, res, next) {
  try {
    const milestoneId = req.params.milestoneId;
    const userId = req.user.id;
    const updateData = req.body;

    // Check if milestoneId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(milestoneId)) {
      return res.status(400).json({ message: "Invalid milestone ID" });
    }

    // Find the milestone by id and addedBy to ensure the user owns the milestone
    const milestone = await Milestones.findOne({ _id: milestoneId, addedBy: userId });

    if (!milestone) {
      return res
        .status(404)
        .json({ message: "milestone not found or unauthorized" });
    }

    // Update the milestone with the provided data
    Object.assign(milestone, updateData); // Merge the update data into the existing milestone object
    const updatedMilestone = await milestone.save(); // Save the updated milestone

    // Send success response
    res.status(200).json({
      message: "milestone updated successfully",
      updatedMilestone,
    });
  } catch (error) {
    // Log the error for further investigation
    console.error("Error during milestone update:", error);

    // Send a generic error message to the client
    res.status(500).json({
      message: "An unknown error occurred during milestone update",
    });
  }
}

export { updateMilestone };
