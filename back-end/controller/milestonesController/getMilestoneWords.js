import Word from "../../models/Word.js";

const getMilestoneWords = async (req, res) => {
  try {
    const milestoneId = req.params.milestoneId;
    const userId = req.user.id;

    // Validate the milestoneId
    if (!milestoneId) {
      return res.status(400).json({ message: "Milestone ID is required." });
    }

    // Query words based on user and milestone
    const words = await Word.find({
      addedBy: userId,
      addedMilestone: milestoneId,
    });
    console.log(milestoneId, words);
    // Check if any words are found
    if (!words.length) {
      return res
        .status(404)
        .json({ message: "No words found for this milestone." });
    }

    // Return the words
    res.status(200).json({ message: "Words retrieved successfully.", words });
  } catch (error) {
    console.error("Error while fetching words:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching words." });
  }
};

export { getMilestoneWords };
