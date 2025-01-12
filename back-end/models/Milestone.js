import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "People",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    milestoneType: {type: String, required: true},
    targetWords: { type: Number, required: true },
    wordsCount: { type: Number, required: true },
    memorizedCount: { type: Number, required: true },
    revisionCount: { type: Number, required: true },
    learnSynonyms: {type: Boolean, required: true},
    includeDefinition:{type: Boolean, required: true},
    pinned: {type: Boolean, default: false}
  },
  { timestamps: true }
);

// Adding an index for querying by user
milestoneSchema.index({ addedBy: 1 });

const Milestone = mongoose.model("Milestone", milestoneSchema);

export default Milestone;
