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
    addedWeek: {
      // const moment = require('moment');
      // const addedWeek = moment().format('YYYY-[W]WW');
      // 2024-W42
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Adding an index for querying by user and week
wordSchema.index({ addedBy: 1, addedWeek: 1 });

export const Word = mongoose.model("Word", wordSchema);
