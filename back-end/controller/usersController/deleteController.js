// internal imports
import Users from "../../models/People.js";

// remove user
async function removeUser(req, res, next) {
  try {
    const user = await Users.findByIdAndDelete(req.params.id);

    // Check if user was found and deleted
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User has been removed successfully",
    });
  } catch (err) {
    console.error("Error removing user:", err);
    res.status(500).json({
      message: "Could not delete the user due to a server error",
    });
  }
}

export { removeUser };
