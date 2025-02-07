// external imports
import express from "express";
// internal imports
import { addTestimonial } from "../controller/testimonial/addTestimonialController.js";
import { deleteTestimonial } from "../controller/testimonial/deleteTestimonialController.js";
import { getTestimonials } from "../controller/testimonial/getTestimonialsController.js";
import { updateTestimonial } from "../controller/testimonial/updateTestimonialController.js";
import { verifyAccessToken } from "../middlewares/validate/verifyAccessToken.js";

const router = express.Router();

// get testimonials
router.get("/", getTestimonials);

// post new testimonials
router.post("/", verifyAccessToken, addTestimonial);

// update testimonial
router.patch("/:testimonialId", verifyAccessToken, updateTestimonial);

// delete testimonial
router.delete("/:testimonialId", verifyAccessToken, deleteTestimonial);

export default router;
