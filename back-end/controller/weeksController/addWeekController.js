// external imports

// internal imports
import Weeks from "../../models/Week.js";

async function addWeek(req, res, next) {
  try {
    // Validate request body
    console.log(req.body);
    if (!req.body.name || !req.body.addedBy || !req.body.targetWords) {
      return res.status(400).json({
        message: "Missing required fields: name, addedBy, or targetWords",
      });
    }

    // create new week document
    const newWeek = new Weeks({ ...req.body });

    // save week to db
    const savedWeek = await newWeek.save();

    // Send success response
    res.status(201).json({
      message: "New week created successfully",
      savedWeek,
    });
  } catch (error) {
    // Log the error for further investigation
    console.error("Error during new week creation:", error);

    // Send a generic error message to the client
    res.status(500).json({
      message: "An unknown error occurred during new week creation",
    });
  }
}

export { addWeek };
