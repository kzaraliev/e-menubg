import mongoose from "mongoose";
import User from "@/models/User";
import Restaurant from "@/models/Restaurant";
import Category from "@/models/Category";
import MenuProduct from "@/models/MenuProduct";
import Translation from "@/models/Translation";

const connectMongo = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      "Add the MONGODB_URI environment variable inside .env.local to use mongoose"
    );
  }
  return mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((e) => console.error("Mongoose Client Error: " + e.message));
};

export default connectMongo;
