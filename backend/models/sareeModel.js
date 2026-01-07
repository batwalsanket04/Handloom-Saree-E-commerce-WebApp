import mongoose from "mongoose";

const sareeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Saree", sareeSchema);
