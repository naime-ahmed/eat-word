// external imports
import express from "express";

// internal imports
import { addWord } from "../controller/wordController/addWordController.js";
import { deleteWord } from "../controller/wordController/deleteWordController.js";
import { getWords } from "../controller/wordController/getWordsController.js";
import { updateWord } from "../controller/wordController/updateWordController.js";
import { wordLimiter } from "../middlewares/rateLimiter/wordLimit.js";
import { verifyAccessToken } from "../middlewares/validate/verifyAccessToken.js";

const router = express.Router();

// get words
router.get("/", verifyAccessToken, getWords);

// add words
router.post("/", verifyAccessToken, wordLimiter, addWord);

// edit word
router.patch("/:wordId",verifyAccessToken, updateWord);

// delete word
router.delete("/:wordId", verifyAccessToken, deleteWord);

export default router;