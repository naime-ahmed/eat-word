import mongoose from "mongoose";

const connectToDb = async () => {
  await mongoose
    .connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => {
      console.log("Mongodb is connected");
    })
    .catch((err) => console.log(err));
};
export default connectToDb;
