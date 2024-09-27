// external imports
import jwt from 'jsonwebtoken';

// Function to generate refresh token
export function generateRefreshToken(user){
    return jwt.sign(
        {id: user._id, email: user.email, role: user.role},
        process.env.JWT_REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY}
    )
}

// Function to verify refresh token
export function verifyRefreshToken(token){
    try{
        return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET)
    }catch(err){
        // invalid token
        return null;
    }
}

// Function to generate access token
export function generateAccessToken(user){
    return jwt.sign(
        {id: user._id, email:user.email, role:user.role},
        process.env.JWT_ACCESS_TOKEN_SECRET,
        {expiresIn: JWT_ACCESS_TOKEN_EXPIRY}
    );
}

