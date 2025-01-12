import mongoose from "mongoose";

const wordSchema = new mongoose.Schema(
  {
    word: { type: String, required: true, trim: true },
    meanings: { type: String, default: "" },
    synonyms: { type: String, default: "" },
    definitions: { type: String, default: "" },
    examples: { type: String, default: "" },
    memorized: { type: Boolean, default: false },
    difficultyLevel: { type: String, enum: ["hard", "notSpecified"], default: "notSpecified" },
    contextTags: { type: String, default: "" },
    frequency: { type: Number, default: 0 },
    notes: { type: String, default: "" },
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
    isFavorite: { type: Boolean, default: false },
    learnedScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

wordSchema.index({ addedBy: 1, addedMilestone: 1 });

const Word = mongoose.model("Word", wordSchema);

export default Word;
