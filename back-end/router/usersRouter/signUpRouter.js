// external imports
import express from "express";

// internal imports
import { addUser } from "../../controller/usersController/signUpController.js";

const router = express.Router();

// add user
router.post("/", addUser);

export default router;
