import { updateUserInfoLimiter } from "../../utils/rateLimitersConfig.js";

export const updateUserInfoLimit = async (req, res, next) => {
  if (!req.user?.id) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  const { id: userId } = req.user;

  const limiter = updateUserInfoLimiter;

  try {
    await limiter.consume(userId, 1);
    next();
  } catch (reTry) {
    const retry = Math.ceil(reTry.msBeforeNext / 1000);
    res.set("Retry-After", retry);
    return res.status(429).json({
      code: "TOO_MANY_REQUESTS",
      message: `Too many requests. Try again in ${Math.ceil(retry / 60)}m.`,
      retryAfter: retry,
    });
  }
};
