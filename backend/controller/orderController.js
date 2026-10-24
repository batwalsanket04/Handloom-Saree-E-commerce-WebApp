import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import sareeModel from "../models/sareeModel.js";
import Stripe from "stripe";
import Dotenv from "dotenv";

Dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ───────── helper: deduct stock ───────── */
const deductStock = async (items) => {
  const errors = [];
  for (const item of items) {
    const productId = item._id || item.id;
    if (!productId) continue;

    const product = await sareeModel.findById(productId);
    if (!product) {
      errors.push(`Product ${item.name || productId} not found`);
      continue;
    }

    const qty = Number(item.quantity) || 1;
    if (product.stock < qty) {
      errors.push(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${qty}`);
      continue;
    }

    product.stock -= qty;
    product.updatedAt = new Date();
    await product.save();
  }
  return errors;
};

/* ───────── Place Order with Stripe ───────── */
const placeOrder = async (req, res) => {
  try {
    const { items, amount, address, paymentMethod } = req.body;
    const userId = req.userId;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Items required" });
    }
    if (!address) {
      return res.status(400).json({ success: false, message: "Address required" });
    }
    if (amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    // Validate items and deduct stock
    const stockErrors = await deductStock(items);
    if (stockErrors.length > 0) {
      return res.status(400).json({ success: false, message: "Stock error", errors: stockErrors });
    }

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      paymentMethod: paymentMethod || "stripe",
      status: "Pending",
      payment: false,
    });

    await newOrder.save();

    // Clear cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name, description: item.category || "Saree" },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 18000,
      },
      quantity: 1,
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url, orderId: newOrder._id });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: error.message || "Error placing order" });
  }
};

/* ───────── Verify Stripe Payment ───────── */
const verifyOrder = async (req, res) => {
  try {
    const { orderId, success } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "Order ID required" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (success === "true" || success === true) {
      await orderModel.findByIdAndUpdate(orderId, { payment: true, status: "Order Processing" });
      res.json({ success: true, message: "Payment verified" });
    } else {
      // Payment failed: restore stock and delete order
      for (const item of order.items) {
        const productId = item._id || item.id;
        if (!productId) continue;
        await sareeModel.findByIdAndUpdate(productId, { $inc: { stock: item.quantity || 1 } });
      }
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment cancelled" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Error verifying payment" });
  }
};

/* ───────── Get User Orders ───────── */
const userOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

/* ───────── List All Orders (Admin) ───────── */
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("userId", "name email phone")
      .sort({ date: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error listing all orders:", error);
    res.status(500).json({ success: false, message: "Error fetching all orders" });
  }
};

/* ───────── Update Order Status (Admin) ───────── */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status required" });
    }

    const validStatuses = ["Pending", "Order Processing", "Out for Delivery", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order status updated", data: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Error updating order status" });
  }
};

/* ───────── Place COD Order ───────── */
const placeCodOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Items required" });
    }
    if (!address) {
      return res.status(400).json({ success: false, message: "Address required" });
    }
    if (amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    // Validate items and deduct stock
    const stockErrors = await deductStock(items);
    if (stockErrors.length > 0) {
      return res.status(400).json({ success: false, message: "Stock error", errors: stockErrors });
    }

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment: false,
      status: "Pending",
      paymentMethod: "cod",
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.status(201).json({ success: true, message: "COD order placed successfully", orderId: newOrder._id });
  } catch (error) {
    console.error("Error placing COD order:", error);
    res.status(500).json({ success: false, message: "Failed to place COD order" });
  }
};

 
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await orderModel.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ success: false, message: "Error deleting order" });
  }
};

export { placeOrder, verifyOrder, listOrders, userOrder, placeCodOrder };

