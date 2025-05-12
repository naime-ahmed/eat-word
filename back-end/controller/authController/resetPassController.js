import bcrypt from "bcrypt";
import { sendEmailForgotPass } from "../../helper/sendMail.js";
import Users from "../../models/People.js";
import { forgotPasswordLimiter, resetPasswordLimiter } from "../../utils/rateLimitersConfig.js";
import { generateTempToken, verifyToken } from "../../utils/tokenUtils.js";

export const resetPassword = {
  forgot: async (req, res) => {
    try {
      const ip = req.ip;
      // block check
      const rlGet = await forgotPasswordLimiter.get(ip);
      if (rlGet && rlGet.remainingPoints <= 0) {
        const retry = Math.ceil(rlGet.msBeforeNext / 1000);
        res.set("Retry-After", retry);
        return res
          .status(429)
          .json({
            code: "TOO_MANY_REQUESTS",
            message: `Too many requests. Try again in ${retry / 60}m.`,
            retryAfter: retry,
          });
      }

      const { email } = req.body;
      // always consume one point on each request
      try {
        await forgotPasswordLimiter.consume(ip);
      } catch (rlRej) {
        const retry = Math.ceil(rlRej.msBeforeNext / 1000);
        res.set("Retry-After", retry);
        return res
          .status(429)
          .json({
            code: "TOO_MANY_REQUESTS",
            message: `Too many requests. Try again in ${retry / 60}m.`,
            retryAfter: retry,
          });
      }

      const user = await Users.findOne({ email });
      if (!user)
        return res
          .status(200)
          .json({
            message:
              "If the email is registered, you will receive a reset link.",
          });

      const token = generateTempToken({ id: user._id });
      const url = `${process.env.FRONT_END_URL}/reset-password/?token=${token}`;
      await sendEmailForgotPass(
        email,
        "Password Reset",
        user.name,
        url,
        "Reset Password"
      );
      return res
        .status(200)
        .json({
          message: "If the email is registered, you will receive a reset link.",
        });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Something went wrong! Please try again." });
    }
  },

  reset: async (req, res) => {
    try {
      const ip = req.ip;
      const rlGet = await resetPasswordLimiter.get(ip);
      if (rlGet && rlGet.remainingPoints <= 0) {
        const retry = Math.ceil(rlGet.msBeforeNext / 1000);
        res.set("Retry-After", retry);
        return res
          .status(429)
          .json({
            code: "TOO_MANY_REQUESTS",
            message: `Too many requests. Try again in ${retry / 60}m.`,
            retryAfter: retry,
          });
      }

      const { newPass, token } = req.body;
      try {
        await resetPasswordLimiter.consume(ip);
      } catch (rlRej) {
        const retry = Math.ceil(rlRej.msBeforeNext / 1000);
        res.set("Retry-After", retry);
        return res
          .status(429)
          .json({
            code: "TOO_MANY_REQUESTS",
            message: `Too many requests. Try again in ${retry / 60}m.`,
            retryAfter: retry,
          });
      }

      const payload = verifyToken(token);
      if (!payload)
        return res
          .status(400)
          .json({ message: "Invalid or expired reset token." });
      if (newPass.length < 6)
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long." });

      const hashed = await bcrypt.hash(newPass, 10);
      await Users.findByIdAndUpdate(payload.id, { password: hashed });

      return res
        .status(204)
        .json({ message: "Successful, use new password to sign in" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({
          message: "Something went wrong while resetting the password.",
        });
    }
  },
};
