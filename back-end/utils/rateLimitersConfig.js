import mongoose from "mongoose";
import { RateLimiterMongo } from "rate-limiter-flexible";

const clientPromise = mongoose.connection
  .asPromise()
  .then((conn) => conn.getClient());

// word limiter config
const createWordLimiter = (tier, points, memoryBlock) =>
  new RateLimiterMongo({
    storeClient: clientPromise,
    dbName: "eatWord",
    tableName: "wordRateLimits",
    keyPrefix: `wordAdd:${tier}`,
    points,
    duration: 30 * 24 * 60 * 60, // 30 days in seconds
    inmemoryBlockOnConsumed: memoryBlock,
    blockDuration: 0,
  });

export const wordLimiterTire = {
  regular: createWordLimiter("regular", 200, 201),
  pro: createWordLimiter("pro", 5000, 5001),
};

// word info gen limiter config
const createWordInfoGenLimiter = (points, memoryBlock) => new RateLimiterMongo({
  storeClient: clientPromise,
  dbName: 'eatWord',
  tableName: 'wordInfoGenRateLimits',
  keyPrefix: 'wordInfoGen',
  points,
  duration: 24 * 60 * 60, // 24h in seconds
  inmemoryBlockOnConsumed: memoryBlock,
  blockDuration: 0,
});

export const wordInfoGenLimiterTire = {
  regular: createWordInfoGenLimiter(30, 31),
  pro: createWordInfoGenLimiter(3000, 3001)
};