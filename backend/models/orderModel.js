import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, index: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true, min: 0 },
  address: { type: Object, required: true },
  status: { type: String, default: "Order Processing" },
  payment: { type: Boolean, default: false },
  transactionId: { type: String, default: null },
  date: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Performance indexes
orderSchema.index({ userId: 1, date: -1 });
orderSchema.index({ status: 1, date: -1 });

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
