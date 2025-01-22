import mongoose from "mongoose";

// Define default usage limits for each subscription type
const USAGE_LIMITS = {
  regular: {
    apiCalls: 1000,
    storage: 1024, // in MB
  },
  premium: {
    apiCalls: 5000,
    storage: 5120, // in MB
  },
  elite: {
    apiCalls: 10000,
    storage: 10240, // in MB
  },
};

const peopleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider !== "google";
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
    },
    subscriptionType: {
      type: String,
      enum: ["regular", "premium", "elite"],
      default: "regular",
    },
    subscriptionStartDate: {
      type: Date,
    },
    subscriptionEndDate: {
      type: Date,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    preferredNotificationsType: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },
    preferredLang: {
      type: String,
      default: "",
    },
    preferredDevice: {
      type: String,
      default: "",
    },
    lastLogin: {
      type: Date,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    accountLocked: {
      type: Boolean,
      default: false,
    },
    signupSource: {
      type: String,
      enum: ["organic", "referral", "google", "facebook"],
      default: "organic",
    },
    usageLimit: {
      apiCalls: { type: Number, default: 1000 },
      storage: { type: Number, default: 1024 }, // in MB
    },
    usageCurrent: {
      apiCalls: { type: Number, default: 0 },
      storage: { type: Number, default: 0 }, // in MB
    },
    status: {
      type: String,
      enum: ["Active", "Suspended"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to set usage limits dynamically
peopleSchema.pre("save", function (next) {
  // Treat admins as elite users
  if (this.role === "admin") {
    this.subscriptionType = "elite";
  }

  this.usageLimit = USAGE_LIMITS[this.subscriptionType];

  next();
});

const People = mongoose.model("People", peopleSchema);
export default People;