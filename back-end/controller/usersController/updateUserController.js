import User from "../../models/People.js";

async function updateUserById(req, res) {
  try {
    const userId = req.user.id;
    const updatedData = req.body;

    // Validate input fields
    const allowedUpdates = [
      "name",
      "profilePicture",
      "preferredLang",
      "preferredDevice",
    ];
    const updates = Object.keys(updatedData);
    const isValidUpdate = updates.every((key) => allowedUpdates.includes(key));

    if (!isValidUpdate) {
      return res.status(400).json({
        message:
          "Invalid updates. You can only update: name, profilePicture, preferredLang and, preferredDevice",
      });
    }

    // Update user
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updatedData },
      { new: true, runValidators: true } // Return updated document and validate
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    const updatedUserForClient = {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
      role: updatedUser.role,
      preferredLang: updatedUser.preferredLang,
      preferredDevice: updatedUser.preferredDevice,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    res.status(200).json({
      user: updatedUserForClient,
      message: "User data has been updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);

    res.status(500).json({
      message: "An unknown error occurred while updating user data.",
    });
  }
}

export { updateUserById };
