import mongoose from "mongoose";

const sareeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true },
  image: { type: String, required: true },
  imagePublicId: { type: String, default: null },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "user", default: null },
  stock: { type: Number, default: 1000 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const sareeModel =
  mongoose.models.saree || mongoose.model("saree", sareeSchema);

export default sareeModel;