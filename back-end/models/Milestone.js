import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "People",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    milestoneType: { type: String, required: true },
    comfortableLang: {type: String, required: true},
    learningLang: {type: String, required: true},
    targetWords: { type: Number, required: true },
    story: {type: String, default: ""},
    wordsCount: {
      type: Number,
      required: true,
      validate: [
        {
          validator: function (value) {
            return value <= this.targetWords;
          },
          msg: "wordsCount cannot be greater than targetWords",
        },
      ],
    },
    memorizedCount: {
      type: Number,
      required: true,
      validate: [
        {
          validator: function (value) {
            return value <= this.wordsCount;
          },
          msg: "memorizedCount cannot be greater than wordsCount",
        },
      ],
    },
    revisionCount: {
      type: Number,
      required: true,
      validate: [
        {
          validator: function (value) {
            return value <= this.wordsCount;
          },
          msg: "memorizedCount cannot be greater than wordsCount",
        },
      ],
    },
    learnSynonyms: { type: Boolean, required: true },
    includeDefinition: { type: Boolean, required: true },
    pinned: { type: Boolean, default: false },
    lastRecalled: { type: Date, default: null },
  },
  { timestamps: true }
);

// Adding an index for querying by user
milestoneSchema.index({ addedBy: 1 });

const Milestone = mongoose.model("Milestone", milestoneSchema);

export default Milestone;
