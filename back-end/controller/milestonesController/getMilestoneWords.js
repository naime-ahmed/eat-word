import Word from "../../models/Word.js";
import {
  wordInfoGenLimiterTire,
  wordLimiterTire,
} from "../../utils/rateLimitersConfig.js";

const getMilestoneWords = async (req, res) => {
  try {
    const milestoneId = req.params.milestoneId;
    const userId = req.user.id;
    const subscriptionType = req.user.subscriptionType || "regular";

    if (!milestoneId) {
      return res.status(400).json({ message: "Milestone ID is required." });
    }

    const words = await Word.find({
      addedBy: userId,
      addedMilestone: milestoneId,
    });

    const wordLimiter =
      wordLimiterTire[subscriptionType] || wordLimiterTire.regular;
    const genAILimiter =
      wordInfoGenLimiterTire[subscriptionType] ||
      wordInfoGenLimiterTire.regular;

    let wordConsumedPoints = 0;
    let wordMsBeforeNext = wordLimiter.duration * 1000;

    let genAIConsumePoints = 0;
    let genAIMsBeforeNext = genAILimiter.duration * 1000;

    try {
      const wordRateLimitInfo = await wordLimiter.get(userId);
      const genAIRateLimitInfo = await genAILimiter.get(userId);

      if (wordRateLimitInfo) {
        wordConsumedPoints = wordRateLimitInfo.consumedPoints;
        wordMsBeforeNext = wordRateLimitInfo.msBeforeNext;
      }

      if (genAIRateLimitInfo) {
        genAIConsumePoints = genAIRateLimitInfo.consumedPoints;
        genAIMsBeforeNext = genAIRateLimitInfo.msBeforeNext;
      }
    } catch (error) {
      console.error("Error fetching rate limit info:", error);
    }

    const wordRemaining = wordLimiter.points - Math.min(wordLimiter.points, wordConsumedPoints);
    
    const wordResetAt = new Date(Date.now() + wordMsBeforeNext).toISOString();

    const genAIRemaining =  genAILimiter.points - Math.min(genAILimiter.points, genAIConsumePoints);
    const genAIResetAt = new Date(Date.now() + genAIMsBeforeNext);

    if (!words.length) {
      return res.status(200).json({
        message: "No words found for this milestone.",
        words: [],
        wordRateLimit: {
          total: wordLimiter.points,
          remaining: wordRemaining,
          resetAt: wordResetAt,
        },
        genAIRateLimit: {
          total: genAILimiter.points,
          remaining: genAIRemaining,
          resetAt: genAIResetAt,
        },
      });
    }

    res.status(200).json({
      message: "Words retrieved successfully.",
      words,
      wordRateLimit: {
        total: wordLimiter.points,
        remaining: wordRemaining,
        resetAt: wordResetAt,
      },
      genAIRateLimit: {
        total: genAILimiter.points,
        remaining: genAIRemaining,
        resetAt: genAIResetAt,
      },
    });
  } catch (error) {
    console.error("Error while fetching words:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching words." });
  }
};

export { getMilestoneWords };
