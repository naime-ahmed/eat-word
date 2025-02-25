import User from "../../models/People.js";

export async function getUserById(req, res) {
  try {
    const { userId } = req?.params;

    // Authorization check
    if (userId !== req.user?.id && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized request!" });
    }

    // Fetch user with optimized projection
    const user = await User.findById(userId).select({
      "name": 1,
      "email": 1,
      "role": 1,
      "authProvider": 1,
      "subscriptionType": 1,
      "subscriptionDates": 1,
      "profilePicture": 1,
      "notifications": 1,
      "preferences.language": 1,
      "preferences.device": 1,
      "usage": 1,
      "status": 1,
      "signupSource": 1,
      "isSubscriptionActive": 1
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Transform response for frontend
    const responseData = {
      ...user.toObject({ virtuals: true }),
      _id: user._id,
      security: undefined,
      __v: undefined
    };

    res.status(200).json({
      message: "User retrieved successfully",
      data: responseData
    });
    
  } catch (error) {
    res.status(500).json({
      message: "Server error while processing request",
      errorCode: "USER_FETCH_ERROR"
    });
  }
}