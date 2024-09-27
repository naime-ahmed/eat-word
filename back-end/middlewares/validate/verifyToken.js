// external imports
import ms from "ms";

// Internal imports
import User from '../../models/People.js';
import { generateRefreshToken, verifyRefreshToken } from "../../utils/tokenUtils";

export async function verifyAndRotateRefreshToken(req, res, next) {
    const refreshToken = req.cookies[process.env.COOKIE_NAME]; // Correcting `req.cookie` to `req.cookies`

    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }

    // Verify the refresh token
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Rotate refresh token if valid
    const user = await User.findById(decoded.id);

    if (!user) {
        return res.status(404).json({ message: "User not found" }); 
    }

    const newRefreshToken = generateRefreshToken(user);

    // Calculate maxAge (in milliseconds) from JWT_REFRESH_TOKEN_EXPIRY
    const refreshTokenExpiry = ms(process.env.JWT_REFRESH_TOKEN_EXPIRY)

    // Send the new refresh token in an HTTP-only cookie
    res.cookie(process.env.COOKIE_NAME, newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        signed: true,
        maxAge: refreshTokenExpiry,
    });

    next();
}
