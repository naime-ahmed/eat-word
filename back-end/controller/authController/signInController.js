import bcrypt from "bcrypt";
import ms from "ms";
import Users from "../../models/People.js";
import { loginFailureLimiter } from "../../utils/rateLimitersConfig.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/tokenUtils.js";

async function signIn(req, res, next) {
  try {
    const ip = req.ip;

    // check if IP is already blocked
    const rateLimiterRes = await loginFailureLimiter.get(ip);
    if (rateLimiterRes && rateLimiterRes.remainingPoints <= 0) {
      const retryMin = Math.ceil(rateLimiterRes.msBeforeNext / 1000 / 60);
      res.set("Retry-After", retryMin);
      return res.status(429).json({
        code: "TOO_MANY_REQUESTS",
        message: `Too many failed login attempts. Try again in ${retryMin} minutes.`,
        retryAfter: retryMin,
      });
    }

    // basic validation
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await Users.findOne({ email });
    const passwordMatches =
      user && (await bcrypt.compare(password, user.password));

    if (!user || !passwordMatches) {
      try {
        const rlRes = await loginFailureLimiter.consume(ip, 1);
      } catch (rlRejected) {
        const retrySecs = Math.ceil(rlRejected.msBeforeNext / 1000);
        res.set("Retry-After", retrySecs);
        return res.status(429).json({
          code: "TOO_MANY_REQUESTS",
          message: `Too many failed login attempts. Try again in ${retrySecs} seconds.`,
          retryAfter: retrySecs,
        });
      }

      return res.status(401).json({ message: "Invalid email or password" });
    }

    await loginFailureLimiter.delete(ip);

    // 6) generate & send tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const refreshTokenExpiryMs = ms(process.env.JWT_REFRESH_TOKEN_EXPIRY);

    res.cookie(process.env.COOKIE_NAME, refreshToken, {
      httpOnly: true,
      signed: true,
      maxAge: refreshTokenExpiryMs,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.status(200).json({
      message: "Authentication successful",
      accessToken,
    });
  } catch (err) {
    console.error("SignIn Error:", err);
    res.status(500).json({
      message: "An unknown error occurred during sign-in",
    });
  }
}

export { signIn };
