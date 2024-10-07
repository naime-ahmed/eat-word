// external imports
import express from "express";

// internal imports
import { refreshTokenController } from "../controller/authController/refreshTokenController.js";
import { signIn } from "../controller/authController/signInController.js";
import { signOut } from "../controller/authController/signOutController.js";
import { addUser } from "../controller/authController/signUpController.js";
import { removeUser } from "../controller/usersController/deleteController.js";

const router = express.Router();

// add user for both, root and /sign-up route.
router.post("/", addUser);
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
