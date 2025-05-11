import mongoose from "mongoose";

const LANGUAGE_CODES = ["en", "bn", "es","zh", "hi", "ar", "ru", "pt", "ko", "tr", "vi", "fr", "de", "it", "ja"]; // ISO 639-1 codes

const peopleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxLength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
      validate: {
        validator: function(v) {
          // Ensure password is undefined/empty for non-local auth
          return this.authProvider !== "local" || !!v;
        },
        message: "Password must be provided for local auth",
      },
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      immutable: true,
    },
    subscriptionType: {
      type: String,
      enum: ["regular", "premium", "elite"],
      default: "regular",
    },
    subscriptionDates: {
      start: {
        type: Date,
        validate: {
          validator: function(v) {
            return !this.subscriptionDates?.end || v < this.subscriptionDates.end;
          },
          message: "Start date must be before end date",
        },
      },
      end: {
        type: Date,
        validate: {
          validator: function(v) {
            return !this.subscriptionDates?.start || v > this.subscriptionDates.start;
          },
          message: "End date must be after start date",
        },
      },
    },
    profilePicture: {
      type: String,
      default: "",
      validate: {
        validator: function(v) {
          return v === "" || /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
        },
        message: "Invalid URL format",
      },
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },
    preferences: {
      language: {
        type: String,
        enum: LANGUAGE_CODES,
        default: "en",
      },
      device: {
        type: String,
        enum: ["desktop", "mobile", "tablet", "unspecified"],
        default: "unspecified",
      },
    },
    signupSource: {
      type: String,
      enum: ["organic", "referral", "google", "facebook"],
      default: "organic",
    },
    status: {
      type: String,
      enum: ["active", "deactivate", "suspended", "locked"],
      default: "active",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for subscription status
peopleSchema.virtual("isSubscriptionActive").get(function () {
  if (!this.subscriptionDates || !this.subscriptionDates.end) return false;
  return this.subscriptionDates.end > new Date();
});

// Indexes
peopleSchema.index({ email: 1 });
peopleSchema.index({ subscriptionType: 1, status: 1 });
peopleSchema.index({ "security.lockedUntil": 1 });

// Pre-save hooks
peopleSchema.pre("save", function (next) {
  // Admin override logic
  if (this.role === "admin") {
    this.subscriptionType = "elite";
  }

  next();
});


const People = mongoose.model("People", peopleSchema);
export default People;
