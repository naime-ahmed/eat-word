// external imports
import mongoose from "mongoose";

// internal imports
import Weeks from "../../models/Week.js";

async function updateWeek(req, res, next) {
  try {
    const weekId = req.params.weekId;
    const userId = req.user.id;
    const updateData = req.body;

    // Check if weekId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(weekId)) {
      return res.status(400).json({ message: "Invalid week ID" });
    }

    // Find the week by id and addedBy to ensure the user owns the week
    const week = await Weeks.findOne({ _id: weekId, addedBy: userId });

    if (!week) {
      return res
        .status(404)
        .json({ message: "Week not found or unauthorized" });
    }

    // Update the week with the provided data
    Object.assign(week, updateData); // Merge the update data into the existing week object
    const updatedWeek = await week.save(); // Save the updated week

    // Send success response
    res.status(200).json({
      message: "Week updated successfully",
      updatedWeek,
    });
  } catch (error) {
    // Log the error for further investigation
    console.error("Error during week update:", error);

    // Send a generic error message to the client
    res.status(500).json({
      message: "An unknown error occurred during week update",
    });
  }
}

export { updateWeek };
