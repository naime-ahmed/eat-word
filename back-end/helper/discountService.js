import DiscountGrant from "../models/DiscountGrant.js";
import { devLogger } from "../utils/logger.js";

const DISCOUNT_OFFERS_CONFIG = {
  EARLY_BIRD_FREE_PREMIUM_1_MONTH: {
    id: "EARLY_BIRD_FREE_PREMIUM_1_MONTH",
    description:
      "1 month free Premium subscription for the first 200 early users.",
    isActive: true,
    limit: 200,
    targetSubscriptionType: "premium",
    discountPercentage: 100,
    durationDays: 30,
  },

  // 50% discount using a promo code
  WELCOME50_PREMIUM_1_MONTH: {
    id: "WELCOME50_PREMIUM_1_MONTH",
    description: "50% off your first month of Premium subscription.",
    isActive: false,
    limit: 200,
    targetSubscriptionType: "premium",
    discountPercentage: 50,
    durationDays: 30,
  },

  // A 75% discount on an 'elite' plan for a week, no limit, no code
  ELITE_FLASH_SALE_7_DAYS: {
    id: "ELITE_FLASH_SALE_7_DAYS",
    description: "Limited time: 75% off Elite plan for 7 days!",
    isActive: false,
    limit: null,
    targetSubscriptionType: "elite",
    discountPercentage: 75,
    durationDays: 7,
  },
};

export async function applyDiscountOffer(
  userInstance,
  deviceFingerprint,
  offerId
) {
  const offer = DISCOUNT_OFFERS_CONFIG[offerId];

  if (!offer || !offer.isActive) {
    return {
      applied: false,
      offerId: offer?.id || offerId,
      reason: "Discount offer is not active or does not exist.",
    };
  }

  try {
    // Has this device already claimed THIS specific offer?
    const existingGrant = await DiscountGrant.findOne({
      deviceFingerprint: deviceFingerprint,
      discountOfferId: offer.id,
    });

    if (existingGrant) {
      return {
        applied: false,
        offerId: offer.id,
        reason: "This device has already claimed this discount offer.",
      };
    }

    // Has the global offer limit been reached?
    if (offer.limit !== null && offer.limit !== undefined) {
      const grantCount = await DiscountGrant.countDocuments({
        discountOfferId: offer.id,
      });
      if (grantCount >= offer.limit) {
        return {
          applied: false,
          offerId: offer.id,
          reason: `Global limit of ${offer.limit} for this offer has been reached.`,
        };
      }
    }

    userInstance.subscriptionType = offer.targetSubscriptionType;
    const now = new Date();
    userInstance.subscriptionDates = {
      start: now,
      end: new Date(now.getTime() + offer.durationDays * 24 * 60 * 60 * 1000),
    };

    return { applied: true, offerId: offer.id };
  } catch (error) {
    devLogger.error(
      `Error during discount offer eligibility check for ${offer.id}:`,
      error
    );
    return {
      applied: false,
      offerId: offer.id,
      reason: "Server error during discount check.",
    };
  }
}

export async function recordDiscountGrant(
  userId,
  deviceFingerprint,
  discountOfferId
) {
  if (!userId || !deviceFingerprint || !discountOfferId) {
    devLogger.error(
      "Attempted to record discount grant with missing information."
    );
    return;
  }
  try {
    const grant = new DiscountGrant({
      userId,
      discountOfferId,
      deviceFingerprint,
    });
    await grant.save();
    devLogger.log(
      `Discount grant recorded for UserID: ${userId}, Offer: ${discountOfferId}`
    );
  } catch (error) {
    if (error.code === 11000) {
      devLogger.warn(
        `Attempted to record a duplicate discount grant for UserID: ${userId}, Offer: ${discountOfferId}.`
      );
    } else {
      devLogger.error(
        `Failed to record discount grant for UserID: ${userId}, Offer: ${discountOfferId}:`,
        error
      );
    }
  }
}
