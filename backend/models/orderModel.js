import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  payment: { type: Boolean, default: false },
  paymentMethod: { type: String, enum: ["stripe", "cod"], default: "stripe" },
  status: { type: String, default: "Order Processing" },
  date: { type: Date, default: Date.now },
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
