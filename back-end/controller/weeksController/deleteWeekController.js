// external imports
import mongoose from "mongoose";

// internal imports
import Weeks from "../../models/Week.js";

async function deleteWeek(req, res, next) {
  try {
    const weekId = req.params.weekId;
    const userId = req.user.id;

    // Check if weekId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(weekId)) {
      return res.status(400).json({ message: "Invalid week ID" });
    }

    // Find the week by id and user id (addedBy) and delete
    const deletedWeek = await Weeks.findOneAndDelete({
      _id: weekId,
      addedBy: userId,
    });

    if (!deletedWeek) {
      return res
        .status(404)
        .json({ message: "Week not found or unauthorized" });
    }

    // Send success response
    res.status(200).json({ message: "Week deleted successfully" });
  } catch (error) {
    // Log the error for further investigation
    console.error("Error during week deletion:", error);

    // Send a generic error message to the client
    res.status(500).json({
      message: "An unknown error occurred during week deletion",
    });
  }
}

export { deleteWeek };
