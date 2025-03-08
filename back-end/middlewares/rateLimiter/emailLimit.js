import rateLimit from "express-rate-limit";

export const emailLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3,
  keyGenerator: (req) => req.ip, // Use IP as the key
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: "You've sent 3 message today! Please try again tomorrow.",
    });
  },
});
