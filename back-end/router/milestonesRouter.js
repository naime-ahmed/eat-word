// external imports
import express from "express";

// internal imports
import { addMilestone } from "../controller/milestonesController/addMilestoneController.js";
import { deleteMilestone } from "../controller/milestonesController/deleteMilestoneController.js";
import { getMilestoneWords } from "../controller/milestonesController/getMilestoneWords.js";
import { updateMilestone } from "../controller/milestonesController/updateMilestoneController.js";
import { userMilestones } from "../controller/milestonesController/userMilestonesController.js";
import { verifyAccessToken } from "../middlewares/validate/verifyAccessToken.js";

const router = express.Router();

// insert new milestone into database
router.post("/", verifyAccessToken, addMilestone);

// retrieve milestones form database
router.get("/", verifyAccessToken, userMilestones);

// get the words associated with the milestone id
router.get("/:milestoneId", verifyAccessToken, getMilestoneWords);

// update specific milestone data
router.patch("/:milestoneId", verifyAccessToken, updateMilestone);

// delete specific milestone from db
router.delete("/:milestoneId", verifyAccessToken, deleteMilestone);

export default router;
