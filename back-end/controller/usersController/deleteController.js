// external imports
import jwt from "jsonwebtoken";

// internal imports
import Users from "../../models/People.js";

// remove user
async function removeUser(req, res, next) {
  try {
    // extract the signed token from the httpOnly cookie
    const token = req.signedCookies[process.env.COOKIE_NAME];

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Verify and decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
    const userId = decoded.id;

    // Find and delete the user by ID
    const user = await Users.findByIdAndDelete(userId);

    // Check if user was found and deleted
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // if deleting was successful, clear the refresh cookie
    res.clearCookie(process.env.COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      signed: true,
    });

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
