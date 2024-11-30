import bcrypt from "bcrypt";
import User from "../../models/People.js";

export async function updatePassword(req, res) {
  try {
    const { curPass, newPass } = req.body;
    console.log(req.body);
    // Ensure both currentPass and newPass are provided
    if (!curPass || !newPass) {
      return res.status(400).json({ message: "Both current and new passwords are required." });
    }

    // Find the user
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Validate the provided current password
    const isMatch = await bcrypt.compare(curPass, user.password);
    console.log("isMatch",isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    // Ensure the new password is different from the old password
    const isSamePassword = await bcrypt.compare(newPass, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: "New password cannot be the same as the current password." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPass, 10);

    // Update the password
    await User.findByIdAndUpdate(
      req.user?.id,
      { $set: { password: hashedPassword } },
      { new: true }
    );

    res.status(200).json({
      message: "Password has been updated successfully.",
    });
  } catch (error) {
    console.error("Error updating password:", error);

    res.status(500).json({
      message: "An unknown error occurred while updating the password.",
    });
  }
}
