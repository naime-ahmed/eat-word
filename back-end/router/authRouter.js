// external imports
import express from "express";

// internal imports
import { isUserValid } from "../controller/authController/isUserValidController.js";
import { refreshTokenController } from "../controller/authController/refreshTokenController.js";
import { signIn } from "../controller/authController/signInController.js";
import { signOut } from "../controller/authController/signOutController.js";
import { addUser } from "../controller/authController/signUpController.js";
import { verifyAccessToken } from "../middlewares/validate/verifyAccessToken.js";

import { signInWithGoogle } from '../controller/authController/signInWithGoogleController.js';

const router = express.Router();

// check is the user is valid or not
router.post("/", verifyAccessToken, isUserValid);

// sing up user
router.post("/sign-up", addUser);

// sign in user
router.post("/sign-in", signIn);

// authenticate user via google
router.post("/google", signInWithGoogle);

// sign out user
router.post("/sign-out", signOut);

// validate refresh token
router.post("/refresh-token", refreshTokenController);

export default router;
