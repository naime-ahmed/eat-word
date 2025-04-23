import { RateLimiterMemory } from 'rate-limiter-flexible';

const emailRateLimiter = new RateLimiterMemory({
  points: 3,
  duration: 24 * 60 * 60, // 24 hours
  keyPrefix: 'emailLimiter'
});

export const emailLimiter = async (req, res, next) => {
  const ip = req.ip;
  console.log(ip);
  try {
    await emailRateLimiter.consume(ip);
    next();
  } catch (rejRes) {
    const retryAfterHour = Math.ceil(rejRes.msBeforeNext / (1000 * 60 * 60));
    const resetTime = new Date(Date.now() + rejRes.msBeforeNext).toLocaleString();

    res.status(429).json({
      success: false,
      error: `You've sent 3 messages today! Please try again after ${retryAfterHour} hour, at approximately ${resetTime}.`,
      retryAt: resetTime
    });
  }
};
