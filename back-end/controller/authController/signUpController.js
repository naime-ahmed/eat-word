// external imports
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ms from "ms";

// internal imports
import {
  applyDiscountOffer,
  recordDiscountGrant,
} from "../../helper/discountService.js";
import { sendEmailRegister } from "../../helper/sendMail.js";
import Users from "../../models/People.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateTempToken,
} from "../../utils/tokenUtils.js";

async function signUp(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const potentialUser = { name, email, password: hashedPassword };

    const activation_token = generateTempToken(potentialUser);

    // send verification email
    const url = `${process.env.FRONT_END_URL}/activate/${activation_token}`;
    sendEmailRegister(email, "ACTIVATE YOUR ACCOUNT", "Activate Now", url);

    res.status(200).json({ msg: "Welcome! Please check your email." });
  } catch (err) {
    res.status(500).json({
      message: "An unknown error occurred during registration",
    });
  }
}

const activate = async (req, res) => {
  const { activation_token, deviceFingerPrint } = req.body;
  const promoCode = req.body?.promoCode || "";

  if (!activation_token) {
    return res.status(400).json({ message: "Activation token is required." });
  }

  if (!deviceFingerPrint) {
    return res
      .status(400)
      .json({ message: "Device fingerprint is missing in activation data." });
  }

  try {
    const user = jwt.verify(
      activation_token,
      process.env.JWT_ACTIVATION_TOKEN_SECRET
    );
    const { name, email, password } = user;

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "This email is already registered." });
    }

    const newUser = new Users({ name, email, password, deviceFingerPrint });

    // Apply discount Logic
    const discountResult = await applyDiscountOffer(
      newUser,
      deviceFingerPrint,
      promoCode
    );

    // If discount was successfully applied, record the grant
    if (discountResult.applied) {
      await recordDiscountGrant(
        newUser._id,
        deviceFingerPrint,
        discountResult?.offerId
      );
    }

    const savedUser = await newUser.save();

    // Generate JWT tokens
    const accessToken = generateAccessToken(savedUser);
    const refreshToken = generateRefreshToken(savedUser);

    // Set refresh token cookie
    const refreshTokenExpiry = ms(process.env.JWT_REFRESH_TOKEN_EXPIRY);
    res.cookie(process.env.COOKIE_NAME, refreshToken, {
      httpOnly: true,
      signed: true,
      maxAge: refreshTokenExpiry,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.status(201).json({
      message: "Your account has been successfully activated.",
      accessToken,
    });
  } catch (err) {
    //  Check for duplicate key error (development mode only)
    if (process.env.NODE_ENV === "development" && err.code === 11000) {
      // Generate JWT tokens
      const existingUser = await Users.findOne(err.keyValue);
      const accessToken = generateAccessToken(existingUser);
      const refreshToken = generateRefreshToken(existingUser);

      // Set refresh token cookie
      const refreshTokenExpiry = ms(process.env.JWT_REFRESH_TOKEN_EXPIRY);
      res.cookie(process.env.COOKIE_NAME, refreshToken, {
        httpOnly: true,
        signed: true,
        maxAge: refreshTokenExpiry,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      });
      return res.status(201).json({
        message: "Your account has been successfully activated.",
        accessToken,
      });
    }

    return res
      .status(400)
      .json({ message: "Invalid or expired activation token." });
  }
};

export { activate, signUp };
