import User from "../../models/People.js";

async function updateUserById(req, res) {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const allowedUpdates = ["name", "profilePicture", "preferences", "status", "subscriptionDates", "role"];
    const updateKeys = Object.keys(updates);
    const isValidUpdate = updateKeys.every((key) => allowedUpdates.includes(key));

    if (!isValidUpdate) {
      return res.status(400).json({
        message:
          "Invalid updates. Allowed fields: name, profilePicture, preferences",
      });
    }

    if (updates.preferences) {
      const existingUser = await User.findById(userId);
      updates.preferences = {
        ...existingUser.preferences.toObject(),
        ...updates.preferences,
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      {
        new: true,
        runValidators: true,
        projection: {
          password: 0,
          security: 0,
          __v: 0,
          "usage.limit": 0,
        },
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update error:", error);
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    const message =
      error.name === "ValidationError"
        ? Object.values(error.errors).map((e) => e.message).join(", ")
        : "Failed to update profile";
    res.status(statusCode).json({
      message,
      errorCode: "USER_UPDATE_FAILED",
      ...(error.name === "ValidationError" && { fields: error.errors }),
    });
  }
}

export { updateUserById };
