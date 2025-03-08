// external imports
import express from "express";

// internal imports
import { isUserValid } from "../controller/authController/isUserValidController.js";
import { refreshTokenController } from "../controller/authController/refreshTokenController.js";
import { resetPassword } from "../controller/authController/resetPassController.js";
import { signIn } from "../controller/authController/signInController.js";
import { signInWithGoogle } from "../controller/authController/signInWithGoogleController.js";
import { signOut } from "../controller/authController/signOutController.js";
import {
  activate,
  signUp,
} from "../controller/authController/signUpController.js";
import { verifyAccessToken } from "../middlewares/validate/verifyAccessToken.js";
import { verifyCaptcha } from "../middlewares/validate/verifyCaptcha.js";


const router = express.Router();

// check is the user is valid or not
router.post("/", verifyAccessToken, isUserValid);

// sing up user
router.post("/sign-up", verifyCaptcha , signUp);

// sign in user
router.post("/sign-in", verifyCaptcha, signIn);

// activate the user
router.post("/activate", activate);

// authenticate user via google
router.post("/google", signInWithGoogle);

// sign out user
router.post("/sign-out", signOut);

// reset password request with email
router.post("/forgot-password", resetPassword.forgot);

// reset password request with new pass and token
router.post("/reset-password", resetPassword.reset);

// validate refresh token
router.post("/refresh-token", refreshTokenController);

export default router;
