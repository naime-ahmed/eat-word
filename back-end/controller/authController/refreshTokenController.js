// external imports
import ms from "ms";

// Internal imports
import User from "../../models/People.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/tokenUtils.js";

export async function refreshTokenController(req, res) {
  // console.log(req.signedCookies[process.env.COOKIE_NAME]);
  const refreshToken = req.signedCookies[process.env.COOKIE_NAME];
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);
  const refreshTokenExpiry = ms(process.env.JWT_REFRESH_TOKEN_EXPIRY);

  res.cookie(process.env.COOKIE_NAME, newRefreshToken, {
    httpOnly: true,
    signed: true,
    maxAge: refreshTokenExpiry,
  });

  // Return new access token to frontend
  res.status(200).json({
    id: user._id,
    email: user.email,
    role: user.role,
    accessToken: newAccessToken,
  });
}
