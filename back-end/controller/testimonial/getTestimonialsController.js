import Testimonial from "../../models/Testimonial.js";

export async function getTestimonials(req, res) {
  try {
    const testimonials = await Testimonial.find({});

    if (!testimonials || testimonials.length === 0) {
      return res.status(404).json({
        message: "No testimonials found",
      });
    }

    res.status(200).json({
      message: "Testimonials retrieved successfully",
      testimonials,
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);

    res.status(500).json({
      message: "An error occurred while fetching testimonials",
    });
  }
}
