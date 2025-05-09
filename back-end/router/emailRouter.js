// external imports
import express from "express";

// internal imports
import { sendEmailContact } from '../helper/sendMail.js';
import { emailLimiter } from "../middlewares/rateLimiter/emailLimit.js";
import { verifyCaptcha } from '../middlewares/validate/verifyCaptcha.js';

const router = express.Router();

router.post("/send-contact-email", verifyCaptcha , emailLimiter, async (req, res) => {
  const { name, email, message } = req.body;
  
  try {
    const result = await sendEmailContact(name, email, message);
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
