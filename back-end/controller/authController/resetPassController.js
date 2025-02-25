import bcrypt from "bcrypt";
import { sendEmailForgotPass } from "../../helper/sendMail.js";
import Users from "../../models/People.js";
import { generateTempToken, verifyToken } from "../../utils/tokenUtils.js";


export const resetPassword = {
  forgot: async (req, res) => {
    try {
      const { email } = req.body;
      // Verify if email is registered
      const user = await Users.findOne({ email });
      if (!user) {
        // Generic response for security
        return res
          .status(200)
          .json({ message: "If the email is registered, you will receive a reset link." });
      }

      // Generate the reset token
      const resetToken = generateTempToken({ id: user._id });
      const url = `${process.env.FRONT_END_URL}/reset-password/?token=${resetToken}`;

      // Send email
      await sendEmailForgotPass(
        email,
        "Eat Word | Password Reset",
        user.name,
        url,
        "Reset Password"
      );

      // Success response
      res.status(200).json({ message: "If the email is registered, you will receive a reset link." });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong! Please try again." });
    }
  },

  reset: async (req, res) => {
    try {
      const { newPass, token } = req.body;
      // Validate token
      const payload = verifyToken(token);
      if (!payload) {
        return res.status(400).json({ message: "Invalid or expired reset token." });
      }

      // Validate password complexity
      if (newPass.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long." });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(newPass, 10);

      // Update user password
      await Users.findByIdAndUpdate(payload.id, { password: hashedPassword });

      // Success response
      res.status(204).json({message: "Successful, Use new password to sign In"}); // No content
    } catch (error) {
      res.status(500).json({ message: "Something went wrong while resetting the password." });
    }
  },
};
