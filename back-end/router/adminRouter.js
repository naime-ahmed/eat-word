// external imports
import express from "express";

import { suspendUser } from "../controller/admin/suspendUserController.js";
import { verifyAccessToken } from "../middlewares/validate/verifyAccessToken.js";
import { verifyIsAdmin } from "../middlewares/validate/verifyIsAdmin.js";
// external imports
const router = express.Router();

// get users
// router.get("/");

// suspend account
router.patch("/suspend/:userId", verifyAccessToken, verifyIsAdmin, suspendUser);

export default router;
