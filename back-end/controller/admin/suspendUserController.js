// Internal imports
import User from "../../models/People.js";

async function suspendUser(req, res) {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    // Validate input
    if (!status || !["Active", "Suspended"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Allowed values: 'Active' or 'Suspended'",
      });
    }

    // Update user
    const updates = {
      status,
      // Reset accountLocked if suspending
      ...(status === "Suspended" && { accountLocked: false }),
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `Account successfully ${
        status.toLowerCase() === "active" ? "activated" : "suspended"
      }`,
    });
  } catch (error) {
    console.error("Error updating account status:", error);
    res.status(500).json({
      message: "Server error while updating account status",
    });
  }
}

export { suspendUser };
