import mongoose from "mongoose";
import Milestones from "../../models/Milestone.js";

async function updateMilestone(req, res) {
  try {
    const { milestoneId } = req.params;
    const { id: userId } = req.user;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(milestoneId)) {
      return res.status(400).json({ message: "Invalid milestone ID format" });
    }

    const allowedFields = ['name', 'targetWords', 'wordsCount', 'memorizedCount', "revisionCount"];
    const invalidFields = Object.keys(updateData).filter(
      field => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: "Invalid update fields",
        invalidFields
      });
    }

    const updatedMilestone = await Milestones.findOneAndUpdate(
      { _id: milestoneId, addedBy: userId },
      { $set: updateData },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!updatedMilestone) {
      return res.status(404).json({ 
        message: "Milestone not found or unauthorized" 
      });
    }
    res.status(200).json({
      message: "Milestone updated successfully",
      milestone: updatedMilestone
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.keys(error.errors).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {})
      });
    }

    console.error("Milestone update error:", error);
    res.status(500).json({
      message: "Failed to update milestone",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export { updateMilestone };
