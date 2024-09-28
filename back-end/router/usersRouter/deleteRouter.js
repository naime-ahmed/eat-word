// external imports
import express from "express";

// internal imports
import { removeUser } from "../../controller/usersController/deleteController.js";

const router = express.Router();

// add user
router.delete("/:id", removeUser);

export default router;
