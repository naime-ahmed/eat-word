// external imports
import express from "express";

// internal imports
import { addWeek } from "../controller/weeksController/addWeekController.js";
import { deleteWeek } from "../controller/weeksController/deleteWeekController.js";
import { getAllWeeks } from "../controller/weeksController/getWeeksController.js";
import { updateWeek } from "../controller/weeksController/updateWeekController.js";
import { verifyAccessToken } from "../middlewares/validate/verifyAccessToken.js";

const router = express.Router();

// insert new week into database
router.post("/", verifyAccessToken, addWeek);

// retrieve weeks form database
router.get("/", verifyAccessToken, getAllWeeks);

// update specific week data
router.put("/:weekId", verifyAccessToken, updateWeek);

// delete specific week from db
router.delete("/:weekId", verifyAccessToken, deleteWeek);

export default router;
