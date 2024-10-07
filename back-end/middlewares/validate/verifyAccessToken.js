// external imports
import jwt from "jsonwebtoken";

export async function verifyAccessToken(req, res, next) {
  // Get the token from the authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  // Return error if token is not provided
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

    // Attach decoded token data to req.user for further use in next middleware
    req.user = decoded;
    next();
  } catch (error) {
    // Handle specific errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Generic fallback for any other errors
    console.error("Error verifying token:", error);
    return res.status(500).json({ message: "Failed to authenticate token" });
  }
}
