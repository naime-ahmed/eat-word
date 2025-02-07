import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxLength: [30, "Name cannot exceed 30 characters"],
    },
    review: {
      type: String,
      required: [true, "Review is required"],
      minLength: [10, "Review should be at least 10 characters"],
      maxLength: [255, "Review cannot exceed 250 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    profession: {
      type: String,
      trim: true,
      maxLength: [50, "Profession cannot exceed 50 characters"],
    },
    photo: {
      type: String,
      default: "https://i.postimg.cc/CLLYW69V/default-User-Profile-Image.png",
      validate: {
        validator: function (v) {
          return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common query patterns
testimonialSchema.index({ rating: -1 });
testimonialSchema.index({ createdAt: -1 });

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;
