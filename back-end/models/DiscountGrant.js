import mongoose from "mongoose";

const discountGrant = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'People',
      required: true,
      index: true,
    },
    discountOfferId: {
      type: String,
      required: true,
      index: true,
    },
    deviceFingerprint: {
      type: String,
      required: true,
      index: true,
    },
    grantedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

discountGrant.index({ deviceFingerprint: 1, discountOfferId: 1 }, { unique: true });

discountGrant.index({ userId: 1 });

const DiscountGrant = mongoose.model('DiscountGrant', discountGrant);

export default DiscountGrant;