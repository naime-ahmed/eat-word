// internal imports
import User from "../../models/People.js";

async function getUserById(req, res) {
  try {
    const { userId } = req?.params;

    if (userId !== req.user?.id && req.user?.role !== "admin") {
      return res.status(400).json({ message: "Unauthorized request!" });
    }
    // Fetch user from the database
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userWithoutPass = {
      id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      role: user.role,
      authProvider: user.authProvider,
      preferredLang: user.preferredLang,
      preferredDevice: user.preferredDevice,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Send success response
    res.status(200).json({
      message: "User retrieved successfully",
      data: userWithoutPass,
    });
  } catch (error) {
    console.error("Error while retrieving user:", error);
    res.status(500).json({
      message: "Oops, something went wrong!",
    });
  }
}

export { getUserById };
