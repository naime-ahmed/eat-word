// external imports
import bcrypt from "bcrypt";
import ms from "ms";

// internal imports
import Users from "../../models/People.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/tokenUtils.js";

// register user
async function addUser(req, res, next) {
  try {
    // Check if the email is already registered
    const existingUser = await Users.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create new user
    const newUser = new Users({ ...req.body, password: hashedPassword });

    // Save user
    const savedUser = await newUser.save();

    // Generate JWT access token and refresh token
    const accessToken = generateAccessToken(savedUser);
    const refreshToken = generateRefreshToken(savedUser);

    // Store refresh token in HTTP-only cookie
    const refreshTokenExpiry = ms(process.env.JWT_REFRESH_TOKEN_EXPIRY);

    res.cookie(process.env.COOKIE_NAME, refreshToken, {
      httpOnly: true,
      signed: true,
      maxAge: refreshTokenExpiry,
    });

    // Send success response with token
    res.status(201).json({
      message: "Registration successful",
      accessToken, // Send token to client
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

export { addUser };
