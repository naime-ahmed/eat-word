// external imports
import express from "express";

// internal imports
import { generateMilestoneStory } from "../controller/generativeAIController/storyWithWordsController.js";
import { generateWordInfo } from "../controller/generativeAIController/wordInfoController.js";
import { verifyAccessToken } from "../middlewares/validate/verifyAccessToken.js";

const router = express.Router();

router.patch("/word-info/:wordId", verifyAccessToken, generateWordInfo);

router.patch("/story/:milestoneId", verifyAccessToken, generateMilestoneStory);

export default router;