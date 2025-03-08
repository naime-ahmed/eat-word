import mongoose from "mongoose";

<<<<<<< HEAD
const CHARACTER_LIMITS = {
  word: 35,
  meanings: 100,
  synonyms: 100,
  definitions: 250,
  examples: 255,
};
=======
import { wordFieldsAndLimit as CHARACTER_LIMITS } from "../utils/wordFieldsAndLimit.js";
>>>>>>> dev

const wordSchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: [true, "Word is required"],
      trim: true,
      maxLength: [
        CHARACTER_LIMITS.word,
        `Word cannot exceed ${CHARACTER_LIMITS.word} characters`,
      ],
      unique: true,
    },
    meanings: {
      type: String,
      default: "",
      maxLength: [
        CHARACTER_LIMITS.meanings,
        `Meanings cannot exceed ${CHARACTER_LIMITS.meanings} characters`,
      ],
    },
    synonyms: {
      type: String,
      default: "",
      maxLength: [
        CHARACTER_LIMITS.synonyms,
        `Synonyms cannot exceed ${CHARACTER_LIMITS.synonyms} characters`,
      ],
    },
    definitions: {
      type: String,
      default: "",
      maxLength: [
        CHARACTER_LIMITS.definitions,
        `Definitions cannot exceed ${CHARACTER_LIMITS.definitions} characters`,
      ],
    },
    examples: {
      type: String,
      default: "",
      maxLength: [
        CHARACTER_LIMITS.examples,
        `Examples cannot exceed ${CHARACTER_LIMITS.examples} characters`,
      ],
    },
    memorized: {
      type: Boolean,
      default: false,
    },
    difficultyLevel: {
      type: String,
      enum: {
        values: ["hard", "notSpecified"],
        message: "Invalid difficulty level",
      },
      default: "notSpecified",
      validate: {
        validator: function (v) {
          return !(this.memorized && v === "notSpecified");
        },
        message: "Memorized words must have a specified difficulty level",
      },
    },
    contextTags: {
      type: String,
      default: "",
      maxLength: [100, "Context tags cannot exceed 100 characters"],
    },
    frequency: {
      type: Number,
      min: [0, "Frequency cannot be negative"],
      default: 0,
    },
    notes: {
      type: String,
      maxLength: [500, "Notes cannot exceed 1000 characters"],
      default: "",
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "People",
      required: [true, "User reference is required"],
    },
    addedMilestone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Milestone",
      required: [true, "Milestone reference is required"],
      validate: {
        validator: async function (value) {
          const milestone = await mongoose.model("Milestone").findById(value);
          return milestone && milestone.addedBy.equals(this.addedBy);
        },
        message: "Milestone does not belong to the user",
      },
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    learnedScore: {
      type: Number,
      min: [0, "Score cannot be negative"],
      max: [100, "Score cannot exceed 100"],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

wordSchema.index({ addedBy: 1, addedMilestone: 1 });
wordSchema.index({
  word: "text",
});

const Word = mongoose.model("Word", wordSchema);

export default Word;
