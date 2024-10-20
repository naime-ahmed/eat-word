import mongoose from "mongoose";

const wordSchema = new mongoose.Schema(
  {
    word: { type: String, required: true, trim: true },
    meanings: [{ type: String, required: true }],
    synonyms: [{ type: String }],
    definitions: [{ type: String }],
    examples: [{ type: String }],
    memorized: { type: Boolean, default: false },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "People",
      required: true,
    },
    addedMilestone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Milestone",
      required: true,
    },
  },
  { timestamps: true }
);

// Adding an index for querying by user and milestone
wordSchema.index({ addedBy: 1, addedMilestone: 1 });

const Word = mongoose.model("Word", wordSchema);

export default Word
