import Quiz from "../../models/Quiz.js";

export const getMilestoneQuiz = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { id: userId } = req.user;

    if (!milestoneId) {
      return res.status(400).json({ message: "Milestone ID is required." });
    }

    const quizzes = await Quiz.find({
      userId,
      milestoneId,
    }).sort({ createdAt: -1 });

    if (!quizzes || quizzes.length === 0) {
      return res.status(206).json({
        message: "No quizzes found for this milestone.",
        quizzes: [],
      });
    }

    res.status(200).json({
      message: "Quizzes retrieved successfully.",
      quizzes,
    });
  } catch (error) {
    console.error("Error while fetching quizzes:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching quizzes." });
  }
};
