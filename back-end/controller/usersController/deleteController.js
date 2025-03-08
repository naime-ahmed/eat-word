// external imports
import jwt from "jsonwebtoken";

// internal imports
import Milestone from "../../models/Milestone.js";
import Users from "../../models/People.js";
import Word from "../../models/Word.js";

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

    // Delete all words created by the user
    await Word.deleteMany({ addedBy: userId });

    // Delete all milestones created by the user
    await Milestone.deleteMany({ addedBy: userId });

    // Delete the user
    const user = await Users.findByIdAndDelete(userId);

    // Check if user was found and deleted
    if (!user) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    // If deleting was successful, clear the refresh cookie
    res.clearCookie(process.env.COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      signed: true,
    });

    res.status(200).json({
      message: "Account and all associated content have been removed successfully",
    });
  } catch (err) {
    console.error("Error removing user:", err);
    res.status(500).json({
      message: "Could not delete the account due to a server error",
    });
  }
}

export { removeUser };
