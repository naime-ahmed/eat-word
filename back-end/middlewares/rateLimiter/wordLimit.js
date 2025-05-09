import { wordLimiterTire } from "../../utils/rateLimitersConfig.js";

export const wordLimiter = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        code: "UNAUTHORIZED",
        message: "Authentication required",
      });
    }

    const { id: userId, subscriptionType = "regular" } = req.user;
    const limiter = wordLimiterTire[subscriptionType] || wordLimiterTire.regular;

    try {
      const rateLimiterRes = await limiter.consume(userId, 1);

      res.set({
        "X-RateLimit-Limit": limiter.points,
        "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
        "X-RateLimit-Reset": Math.ceil(rateLimiterRes.msBeforeNext / 1000),
      });

      next();
    } catch (rateLimiterRes) {
      const daysLeft = Math.ceil(
        rateLimiterRes.msBeforeNext / (1000 * 60 * 60 * 24)
      );
      const resetDate = new Date(Date.now() + rateLimiterRes.msBeforeNext);

      res.set("Retry-After", Math.ceil(rateLimiterRes.msBeforeNext / 1000));
      return res.status(429).json({
        code: "RATE_LIMIT_EXCEEDED",
        message: `Monthly word limit exceeded for ${subscriptionType} plan`,
        limit: monthlyLimit,
        attempted: 1,
        remaining: rateLimiterRes.remainingPoints,
        retryAfter: {
          seconds: Math.ceil(rateLimiterRes.msBeforeNext / 1000),
          days: daysLeft,
          isoDate: resetDate.toISOString(),
        },
      });
    }
  } catch (error) {
    console.error("Rate limit error:", error);
    return res.status(500).json({
      code: "SERVER_ERROR",
      message: "Internal server error",
    });
  }
};
