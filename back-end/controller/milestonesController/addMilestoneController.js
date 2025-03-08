// external imports

// internal imports
import Milestones from "../../models/Milestone.js";

async function addMilestone(req, res, next) {
  try {
    // Validate request body
    if (!req.body.name || !req.body.addedBy || !req.body.targetWords || !req.body.milestoneType) {
      return res.status(400).json({
        message: "Missing required fields: name, addedBy, or milestoneType",
      });
    }

    // create new milestone document
    const newMilestone = new Milestones({ ...req.body });

    // save milestone to db
    await newMilestone.save();

    // Send success response
    res.status(201).json({
      message: "New milestone created successfully",
    });
  } catch (error) {
    // Log the error for further investigation
    console.error("Error during new milestone creation:", error);

    // Send a generic error message to the client
    res.status(500).json({
      message: "An unknown error occurred during new milestone creation",
    });
  }
}

export { addMilestone };
