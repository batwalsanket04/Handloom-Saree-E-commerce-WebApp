import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  items: { 
    type: Array, 
    required: true,
    validate: {
      validator: function(v) { return Array.isArray(v) && v.length > 0; },
      message: "Order must contain at least one item"
    }
  },
  amount: { type: Number, required: true, min: 0 },
  address: { type: Object, required: true },
  payment: { type: Boolean, default: false },
  paymentMethod: { type: String, enum: ["stripe", "cod"], default: "stripe" },
  status: { 
    type: String, 
    enum: ["Pending", "Order Processing", "Out for Delivery", "Delivered", "Cancelled"], 
    default: "Pending" 
  },
  stripePaymentId: { type: String, default: null },
  transactionId: { type: String, default: null },
  date: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
