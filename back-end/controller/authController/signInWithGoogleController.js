// external imports
import { OAuth2Client } from "google-auth-library";
import ms from "ms"; // Ensure ms is imported

// internal imports
import { applyDiscountOffer, recordDiscountGrant } from "../../helper/discountService.js";
import Users from "../../models/People.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/tokenUtils.js";

async function signInWithGoogle(req, res, next) {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const { token, deviceFingerPrint, promoCode } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Google ID token is required" });
  }

  if (!deviceFingerPrint) {
    return res
      .status(400)
      .json({ message: "Device fingerprint is missing in activation data." });
  }

  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture } = ticket.getPayload();

    // Find or create user in your database
    let user = await Users.findOne({ email });
    let isNewUser = false;

    if (!user) {
      user = new Users({
        name,
        email,
        authProvider: "google",
        profilePicture: picture,
        deviceFingerPrint,
      });

      // Apply discount Logic
      const discountResult = await applyDiscountOffer(
        user,
        deviceFingerPrint,
        promoCode
      );

      if (discountResult.applied) {
        await recordDiscountGrant(
          user._id,
          deviceFingerPrint,
          discountResult?.offerId
        );
      }
      isNewUser = true;

      await user.save();
    }

    // Generate tokens
    const refreshToken = generateRefreshToken(user);
    const accessToken = generateAccessToken(user);

    // Set refresh token in HTTP-only cookie
    const refreshTokenExpiry = ms(process.env.JWT_REFRESH_TOKEN_EXPIRY);
    res.cookie(process.env.COOKIE_NAME, refreshToken, {
      httpOnly: true,
      signed: true,
      maxAge: refreshTokenExpiry,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    // Send success response with tokens and user details
    res.status(isNewUser ? 201 : 200).json({
      message: isNewUser ? "Registration successful" : "Login successful",
      accessToken,
      user: {
        name,
        email,
        picture,
      },
    });
  } catch (error) {
    console.error("Google authentication error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
}

export { signInWithGoogle };
