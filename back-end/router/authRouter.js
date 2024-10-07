// external imports
import express from "express";

// internal imports
import { isUserValid } from "../controller/authController/isUserValidController.js";
import { refreshTokenController } from "../controller/authController/refreshTokenController.js";
import { signIn } from "../controller/authController/signInController.js";
import { signOut } from "../controller/authController/signOutController.js";
import { addUser } from "../controller/authController/signUpController.js";
import { removeUser } from "../controller/usersController/deleteController.js";
import { verifyAccessToken } from "../middlewares/validate/verifyAccessToken.js";

const router = express.Router();

// check is the user is valid or not
router.get("/", verifyAccessToken, isUserValid);

// sing up user
router.post("/sign-up", addUser);

// sign in user
router.post("/sign-in", signIn);

// sign out user
router.post("/sign-out", signOut);

// delete user
router.delete("/delete-me", removeUser);

// validate refresh token
router.get("/refresh-token", refreshTokenController);

export default router;
