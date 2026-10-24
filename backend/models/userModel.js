import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "seller", "admin"], default: "user", index: true },
  cartData: { type: Object, default: {} },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "saree" }],
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { minimize: false });

// Performance indexes
userSchema.index({ createdAt: -1 });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;

