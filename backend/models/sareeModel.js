import mongoose from "mongoose";

const sareeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  imagePublicId: { type: String, default: null },
  stock: { type: Number, default: 1000, min: 0 },
sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Performance indexes
sareeSchema.index({ category: 1 });
sareeSchema.index({ name: "text", description: "text", category: "text" });
sareeSchema.index({ createdAt: -1 });

const sareeModel =
  mongoose.models.saree || mongoose.model("saree", sareeSchema);


export default sareeModel;