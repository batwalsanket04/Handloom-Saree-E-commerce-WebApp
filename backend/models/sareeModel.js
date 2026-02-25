import mongoose from "mongoose";

const sareeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  imagePublicId: { type: String, default: null },
});

const sareeModel =
  mongoose.models.saree || mongoose.model("saree", sareeSchema);

export default sareeModel;