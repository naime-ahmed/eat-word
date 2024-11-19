// external imports
import express from "express";
import { removeUser } from "../controller/usersController/deleteController.js";
import { getUserById } from "../controller/usersController/getUserById.js";
import { verifyAccessToken } from "../middlewares/validate/verifyAccessToken.js";

// internal imports

const router = express.Router();

// get users
// router.get("/");

// get a user by id
router.get("/:userId", verifyAccessToken, getUserById);

// delete user
router.delete("/delete-me", removeUser);

export default router;
