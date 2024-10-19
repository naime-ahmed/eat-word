import mongoose from "mongoose";

const weekSchema = new mongoose.Schema(
  {
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "People",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    targetWords: { type: Number, required: true },
    wordsCount: { type: Number, required: true },
    memorizedCount: { type: Number, required: true },
    revisionCount: { type: Number, required: true },
  },
  { timestamps: true }
);

// Adding an index for querying by user
weekSchema.index({ addedBy: 1 });

const Week = mongoose.model("Week", weekSchema);

export default Week;
