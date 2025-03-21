// external imports
import express from "express";
// internal imports
import { addTestimonial } from "../controller/testimonial/addTestimonialController.js";
import { deleteTestimonial } from "../controller/testimonial/deleteTestimonialController.js";
import { getTestimonials } from "../controller/testimonial/getTestimonialsController.js";
import { updateTestimonial } from "../controller/testimonial/updateTestimonialController.js";
import { verifyAccessToken } from "../middlewares/validate/verifyAccessToken.js";

const router = express.Router();

// get reviews
router.get("/", getTestimonials);

// post new reviews
router.post("/", verifyAccessToken, addTestimonial);

// update reviews
router.patch("/:id", verifyAccessToken, updateTestimonial);

// delete reviews
router.delete("/:id", verifyAccessToken, deleteTestimonial);

export default router;
