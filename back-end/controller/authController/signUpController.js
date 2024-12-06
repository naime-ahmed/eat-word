// external imports
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ms from "ms";

// internal imports
import { sendEmailRegister } from "../../helper/sendMail.js";
import Users from "../../models/People.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateTempToken
} from "../../utils/tokenUtils.js";

// register user
async function signUp(req, res, next) {
  try {
    const { name, email, password } = req.body;
    // Check if the email is already registered
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate activation token
    const potentialUser = { name, email, password: hashedPassword };
    console.log(potentialUser);
    const activation_token = generateTempToken(potentialUser);

    // send verification email
    const url = `${process.env.FRONT_END_URL}/activate/${activation_token}`;
    sendEmailRegister(email, "ACTIVATE YOUR ACCOUNT", "Activate Now", url);

    // registration success
    res.status(200).json({ msg: "Welcome! Please check your email." });
  } catch (err) {
    // Log the error for further investigation
    console.error("Error during user registration:", err);

    // Send a generic error message to the client
    res.status(500).json({
      message: "An unknown error occurred during registration",
    });
  }
}

const activate = async (req, res) => {
  const { activation_token } = req.body;

  try {
    // Verify token
    const user = jwt.verify(
      activation_token,
      process.env.JWT_ACTIVATION_TOKEN_SECRET
    );
    const { name, email, password } = user;

    // Check for existing user
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      console.log("inside dup email");
      return res.status(400).json({ msg: "This email is already registered." });
    }

    // Create new user
    const newUser = new Users({ name, email, password });
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
    });
    // Success response
    res.status(201).json({
      message: "Your account has been successfully activated.",
      accessToken,
    });
  } catch (err) {
    console.error("Error during account activation:", err);

    //  Check for duplicate key error (development mode only)
    if(process.env.NODE_ENV === "development" && err.code === 11000){
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
      });
      return res.status(201).json({
        message: "Your account has been successfully activated.",
        accessToken
      });
    }

    return res
      .status(400)
      .json({ msg: "Invalid or expired activation token." });
  }
};

export { activate, signUp };
