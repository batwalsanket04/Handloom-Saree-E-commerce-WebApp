// config/db.js
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb+srv://batwalsanket:Sanket%401234@cluster0.4miqrrx.mongodb.net/myDatabase?retryWrites=true&w=majority";
    console.log("Connecting to MongoDB...");
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
