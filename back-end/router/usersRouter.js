// external imports
import express from "express";

// internal imports
import { removeUser } from "../controller/usersController/deleteController.js";
import { getUserById } from "../controller/usersController/getUserController.js";
import { updatePassword } from "../controller/usersController/updatePasswordController.js";
import { updateUserById } from "../controller/usersController/updateUserController.js";
import { updateUserInfoLimit } from "../middlewares/rateLimiter/updateUserInfoLimit.js";
import { verifyAccessToken } from "../middlewares/validate/verifyAccessToken.js";

const router = express.Router();

// get a user by id
router.get("/:userId", verifyAccessToken, getUserById);

// update user info by id
router.put("/", verifyAccessToken, updateUserInfoLimit, updateUserById);

// update password
router.put(
  "/update-pass",
  verifyAccessToken,
  updateUserInfoLimit,
  updatePassword
);

// delete user
router.delete("/delete-me", verifyAccessToken, removeUser);

export default router;
