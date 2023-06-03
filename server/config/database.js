import mongoose, { mongo } from "mongoose";

mongoose.set("strictQuery", true);

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("database connected successfully");
  } catch (error) {
    console.log("database failed to connect \n error :-", error);
  }
};
