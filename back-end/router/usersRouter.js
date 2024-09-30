// external imports
import express from "express";

// internal imports
import { removeUser } from "../controller/usersController/deleteController.js";
import { addUser } from "../controller/usersController/signUpController.js";

const router = express.Router();

// add user for both, root and /sing-up route.
router.post("/", addUser);
router.post("/sing-up", addUser);

// delete user
router.delete("/delete-me/:id", removeUser);

export default router;
