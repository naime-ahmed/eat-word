// external imports

// internal imports
import Weeks from "../../models/Week.js";

async function getUsersAllWeeks(req, res, next) {
  try {
    const userId = req.user.id;

    // Fetch all weeks
    const weeks = await Weeks.find({ addedBy: userId });

    if (!weeks || weeks.length === 0) {
      return res.status(404).json({
        message: "No weeks found for this user",
      });
    }

    // Send response with the retrieved weeks
    res.status(200).json({
      message: "Weeks retrieved successfully",
      weeks,
    });
  } catch (error) {
    // Log the error for further investigation
    console.error("Error fetching weeks:", error);

    // Send a generic error message to the client
    res.status(500).json({
      message: "An unknown error occurred while retrieving weeks",
    });
  }
}

export { getUsersAllWeeks };
