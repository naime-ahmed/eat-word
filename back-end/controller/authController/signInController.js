// external imports
import bcrypt from "bcrypt";
import ms from "ms";

// internal imports
import Users from "../../models/People.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/tokenUtils.js";

async function signIn(req, res, next) {
  try {

    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const hasUser = await Users.findOne({ email: req.body.email });

    if (!hasUser) {
      return res.status(404).json({ message: "Please sign up first" });
    }

    // compare the given password with the stored one
    const isSamePass = await bcrypt.compare(
      req.body.password,
      hasUser.password
    );

    if (!isSamePass) {
      return res.status(401).json({ message: "Invalid Password or Email!" });
    }

    // grant access to account and generate tokens
    const accessToken = generateAccessToken(hasUser);
    const refreshToken = generateRefreshToken(hasUser);

    const refreshTokenExpiry = ms(process.env.JWT_REFRESH_TOKEN_EXPIRY);

    // Store refresh token in HTTP-only cookie
    res.cookie(process.env.COOKIE_NAME, refreshToken, {
      httpOnly: true,
      signed: true,
      maxAge: refreshTokenExpiry,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    // Send success response with access token
    res.status(200).json({
      message: "Authentication successful",
      accessToken,
    });
  } catch (err) {
    // Handle any server error
    res.status(500).json({
      message: "An unknown error occurred during sign-in",
    });
  }
}

export { signIn };
