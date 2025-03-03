// external imports
import ms from "ms";

// Internal imports
import User from "../../models/People.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/tokenUtils.js";

// Helper for consistent error responses
const errorResponse = (res, status, message) =>
  res.status(status).json({ success: false, error: message });

export async function refreshTokenController(req, res) {
  try {
    const refreshToken = req.signedCookies[process.env.COOKIE_NAME];
    if (!refreshToken) {
      return errorResponse(
        res,
        401,
        "Authentication required: No refresh token provided"
      );
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded?.id) {
      return errorResponse(res, 403, "Invalid or expired refresh token");
    }

    const user = await User.findById(decoded.id).select("_id email role");
    if (!user) {
      return errorResponse(res, 404, "User account not found");
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    const refreshTokenExpiry = ms(process.env.JWT_REFRESH_TOKEN_EXPIRY);
    if (!refreshTokenExpiry) {
      console.error("Invalid JWT_REFRESH_TOKEN_EXPIRY configuration");
      return errorResponse(res, 500, "Server configuration error");
    }

    res.cookie(process.env.COOKIE_NAME, newRefreshToken, {
      httpOnly: true,
      signed: true,
      maxAge: refreshTokenExpiry,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.status(200).json({
      id: user._id,
      email: user.email,
      role: user.role,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    errorResponse(res, 500, "Internal server error during token refresh");
  }
}
