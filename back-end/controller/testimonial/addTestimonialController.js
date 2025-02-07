import Testimonial from "../../models/Testimonial.js";

export async function addTestimonial(req, res) {
  try {
    const { name, review, rating, featured, profession } = req.body;
    const photo = req.body.photo || "https://i.postimg.cc/CLLYW69V/default-User-Profile-Image.png";

    const newTestimonial = new Testimonial({
      name,
      review,
      rating,
      featured,
      profession,
      photo,
    });

    await newTestimonial.validate();
    await newTestimonial.save();

    res.status(201).json({
      message: "New testimonial created successfully",
      testimonial: newTestimonial,
    });
  } catch (error) {
    console.error("Error during new testimonial creation:", error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({
      message: "An unknown error occurred during new testimonial creation",
    });
  }
}