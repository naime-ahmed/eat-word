// external imports
import express from "express";
import { removeUser } from "../controller/usersController/deleteController.js";
import { getUserById } from "../controller/usersController/getUserController.js";
import { updatePassword } from "../controller/usersController/updatePasswordController.js";
import { updateUserById } from "../controller/usersController/updateUserController.js";
import { verifyAccessToken } from "../middlewares/validate/verifyAccessToken.js";

// internal imports

const router = express.Router();

// get a user by id
router.get("/:userId", verifyAccessToken, getUserById);

// update user info by id
router.put("/", verifyAccessToken, updateUserById);

// update password
router.put("/update-pass", verifyAccessToken, updatePassword);

// delete user
router.delete("/delete-me",verifyAccessToken, removeUser);

export default router;
