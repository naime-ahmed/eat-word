import Testimonial from "../../models/Testimonial.js";

export async function deleteTestimonial(req, res) {
  try {
    const { id } = req.params;

    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);

    if (!deletedTestimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.status(200).json({
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    res.status(500).json({
      message: "An error occurred while deleting the testimonial",
    });
  }
}
