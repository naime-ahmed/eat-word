// external imports
import express from "express";
import { removeUser } from "../controller/usersController/deleteController.js";
import { getUserById } from "../controller/usersController/getUserController.js";
import { updateUserById } from "../controller/usersController/updateUserController.js";
import { verifyAccessToken } from "../middlewares/validate/verifyAccessToken.js";

// internal imports

const router = express.Router();

// get users
// router.get("/");

// get a user by id
router.get("/:userId", verifyAccessToken, getUserById);

// update user info by id
router.put("/", verifyAccessToken, updateUserById);

// delete user
router.delete("/delete-me", removeUser);

export default router;
