import mongoose from "mongoose";

const connectToDb = async () => {
  let mongoConnectionString;

  if (process.env.NODE_ENV === "development") {
    mongoConnectionString = `mongodb+srv://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_PASS}@eatword-disk.ijsua.mongodb.net/eatWord?retryWrites=true&w=majority&appName=eatword-disk`;
  } else {
    mongoConnectionString = "mongodb://localhost:27017/eatWord";
  }

  try {
    await mongoose.connect(mongoConnectionString);
    console.log("MongoDB is connected");
  } catch (err) {
    console.error("Connection error:", err);
    process.exit(1);
  }
};

export default connectToDb;