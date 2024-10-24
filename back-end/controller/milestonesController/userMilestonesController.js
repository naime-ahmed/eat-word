// external imports

// internal imports
import Milestones from "../../models/Milestone.js";

async function userMilestones(req, res, next) {
  try {
    const userId = req.user.id;

    // Fetch all milestones
    const milestones = await Milestones.find({ addedBy: userId });

    if (!milestones || milestones.length === 0) {
      return res.status(404).json({
        message: "Get out of comfort zone, take challenge, become strong",
      });
    }

    // Send response with the retrieved milestones
    res.status(200).json({
      message: "milestones retrieved successfully",
      milestones,
    });
  } catch (error) {
    // Log the error for further investigation
    console.error("Error fetching milestones:", error);

    // Send a generic error message to the client
    res.status(500).json({
      message: "Opps. Something went wrong!",
    });
  }
}

export { userMilestones };

