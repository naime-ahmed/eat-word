// external imports
import bcrypt from "bcrypt";

// internal imports
import User from "../models/People";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenUtils";


// register user
async function addUser(req, res, next) {
  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create new user
    const newUser = new User({ ...req.body, password: hashedPassword });

    // Save user
    const savedUser = await newUser.save();

    // Generate JWT access token and refresh token
    const accessToken = generateAccessToken(savedUser);
    const refreshToken = generateRefreshToken(savedUser);

    // Store refresh token in HTTP-only cookie
    res.cookie(process.env.COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENB === 'production',
      sameSite: 'strict',
      signed: true,
      maxAge: process.env.JWT_REFRESH_TOKEN_EXPIRY,
    })

    // Send success response with token
    res.status(201).json({
      message: "Registration successful",
      accessToken,  // Send token to client
    });

  } catch (err) {
    // Log the error for further investigation
    console.error("Error during user registration:", err);

    // Send a generic error message to the client
    res.status(500).json({
      message: "An unknown error occurred during registration",
    });
  }
}

// remove user
async function removeUser(req, res, next) {
  try {
    const user = await User.findByIdAndDelete({
      _id: req.params.id,
    });

    res.status(200).json({
      message: "user has removed successfully",
    });
  } catch {
    res.status(500).json({ message: "Could not delete the user!" });
  }
}

module.exports = {
  addUser,
  removeUser,
};
