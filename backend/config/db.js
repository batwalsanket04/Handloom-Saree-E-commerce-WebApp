import mongoose from "mongoose";

// config/db.js
  

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://batwalsanket:Sanket%401234@cluster0.4miqrrx.mongodb.net/paithaniSaree?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
   
  }
};

 


