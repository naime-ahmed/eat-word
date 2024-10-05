// external imports
import express from "express";

// internal imports
import { removeUser } from "../controller/usersController/deleteController.js";
import { signIn } from "../controller/usersController/signInController.js";
import { signOut } from "../controller/usersController/signOutController.js";
import { addUser } from "../controller/usersController/signUpController.js";

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

export default router;
