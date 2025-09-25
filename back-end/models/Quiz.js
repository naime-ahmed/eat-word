import mongoose from "mongoose";

// Sub-schemas
const optionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
}, { _id: false });

const answerSchema = new mongoose.Schema({
  text: { type: String, required: true },
  explanation: { type: String, required: true },
}, { _id: false });

const metadataSchema = new mongoose.Schema({
  questionFocus: {
    type: String,
    enum: ["meaning", "synonym", "definition", "contextual_usage"],
    required: true,
  },
  estimatedTimeSec: { type: Number, required: true },
}, { _id: false });

// This sub-schema represents a single question
const questionAttemptSchema = new mongoose.Schema({
  id: { type: String, required: true },
  quizType: {
    type: String,
    enum: ["multiple_choice", "matching", "true_false"],
    required: true,
  },
  instruction: { type: String, required: true },
  question: { type: String, required: true },
  options: { type: [optionSchema], required: true },
  answer: { type: answerSchema, required: true },
  wordsTested: { type: [String], required: true },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  marks: { type: Number, required: true },
  metadata: { type: metadataSchema, required: true },
  
  // Storing the user's answer and whether it was correct.
  // These are populated when the user takes the quiz.
  userSelectedOptionId: { type: String, default: null },
  isCorrect: { type: Boolean, default: null },
}, { _id: false });


// The main schema for a completed quiz attempt by a user.
const quizSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "People",
      required: true,
    },
    milestoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Milestone",
      required: true,
    },
    questions: {
      type: [questionAttemptSchema],
      required: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    correctCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    incorrectCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    timeTakenSec: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add a compound index for efficient query
quizSchema.index({ userId: 1, milestoneId: 1 });

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;

