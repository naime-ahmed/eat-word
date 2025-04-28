import { wordInfoGenLimiterTire } from "../../utils/rateLimitersConfig.js";

export const wordInfoGenLimit = async (req, res, next) => {
  try {
    if (!req.user?.id) return res.status(401).json({ code: "UNAUTHORIZED" });
    if (!Array.isArray(req.body.fields)) {
      return res.status(400).json({ code: "INVALID_FIELDS" });
    }

    const cost = req.body.fields.length;
    if (cost < 1) return res.status(400).json({ code: "EMPTY_FIELDS" });

    const { subscriptionType = "regular" } = req.user;
    if (subscriptionType === "regular" && cost > 30) {
      return res.status(403).json({ code: "REQUEST_TOO_LARGE" });
    }

    // Get appropriate limiter
    const limiter =
      wordInfoGenLimiterTire[subscriptionType] ||
      wordInfoGenLimiterTire.regular;

    try {
      const result = await limiter.consume(req.user.id, cost);

      res.set({
        "X-RateLimit-Limit": limiter.points,
        "X-RateLimit-Remaining": result.remainingPoints,
        "X-RateLimit-Reset": Math.ceil(result.msBeforeNext / 1000),
      });

      next();
    } catch (result) {
      const retrySec = Math.ceil(result.msBeforeNext / 1000);
      res.set("Retry-After", retrySec);

      return res.status(429).json({
        code: "RATE_LIMIT_EXCEEDED",
        message: `Daily word info generation limit exceeded for ${subscriptionType} plan. Retry after ${Math.ceil(
          retrySec / 60 / 60
        )} hours`,
        limit: limiter.points,
        attempted: cost,
        remaining: result.remainingPoints,
        retryAfter: retrySec,
        resetAt: new Date(Date.now() + result.msBeforeNext).toISOString(),
      });
    }
  } catch (error) {
    console.error("Rate limit error:", error);
    return res.status(500).json({ code: "SERVER_ERROR" });
  }
};
