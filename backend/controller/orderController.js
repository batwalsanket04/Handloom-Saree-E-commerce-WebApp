import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import sareeModel from "../models/sareeModel.js";
import Stripe from "stripe";
import Dotenv from "dotenv";

Dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const isValidId = (id) => Number.isSafeInteger(Number(id)) && Number(id) > 0;

const deductStock = async (items) => {
  const errors = [];

  for (const item of items) {
    const productId = item._id || item.id;
    if (!isValidId(productId)) {
      errors.push("Each order item must include a valid product ID");
      continue;
    }

    const qty = Number(item.quantity ?? 1);
    if (!Number.isFinite(qty) || qty <= 0) {
      errors.push(`Invalid quantity for product ${productId}`);
      continue;
    }

    const product = await sareeModel.findByPk(productId);
    if (!product) {
      errors.push(`Product ${item.name || productId} not found`);
      continue;
    }

    if (Number(product.stock) < qty) {
      errors.push(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${qty}`);
      continue;
    }

    product.stock = Number(product.stock) - qty;
    await product.save();
  }

  return errors;
};

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
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const stockErrors = await deductStock(items);
    if (stockErrors.length > 0) {
      return res.status(400).json({ success: false, message: "Stock error", errors: stockErrors });
    }

    const newOrder = await orderModel.create({
      userId,
      items,
      amount,
      address,
      status: "Order Processing",
      payment: false,
      paymentMethod: paymentMethod || "stripe",
    });

    const user = await userModel.findByPk(userId);
    if (user) {
      await user.update({ cartData: {} });
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name, description: item.category || "Saree" },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: Number(item.quantity) || 1,
    }));

    lineItems.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 18000,
      },
      quantity: 1,
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder.id}`,
      cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder.id}`,
    });

    return res.json({ success: true, session_url: session.url, orderId: newOrder.id });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ success: false, message: error.message || "Error placing order" });
  }
};

const verifyOrder = async (req, res) => {
  try {
    const { orderId, success } = req.body;

    if (!isValidId(orderId)) {
      return res.status(400).json({ success: false, message: "Order ID required" });
    }

    const order = await orderModel.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (success === "true" || success === true) {
      await order.update({ payment: true, status: "Order Processing" });
      return res.json({ success: true, message: "Payment verified" });
    }

    for (const item of order.items) {
      const productId = item._id || item.id;
      if (!productId) continue;
      const product = await sareeModel.findByPk(productId);
      if (product) {
        await product.update({ stock: Number(product.stock) + Number(item.quantity || 1) });
      }
    }

    await order.destroy();
    return res.json({ success: false, message: "Payment cancelled" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({ success: false, message: "Error verifying payment" });
  }
};

const userOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await orderModel.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    return res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.findAll({
      include: [{ model: userModel, as: "user", attributes: ["id", "name", "email", "phone"] }],
      order: [["createdAt", "DESC"]],
    });

    return res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error listing all orders:", error);
    return res.status(500).json({ success: false, message: "Error fetching all orders" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!isValidId(orderId)) {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status required" });
    }

    const validStatuses = [
      "Order Processing",
      "Packed",
      "Shipped",
      "Out For Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await orderModel.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    await order.update({ status, updatedAt: new Date() });
    return res.json({ success: true, message: "Order status updated", data: order });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ success: false, message: "Error updating order status" });
  }
};

const placeCodOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Items required" });
    }
    if (!address) {
      return res.status(400).json({ success: false, message: "Address required" });
    }
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const stockErrors = await deductStock(items);
    if (stockErrors.length > 0) {
      return res.status(400).json({ success: false, message: "Stock error", errors: stockErrors });
    }

    const newOrder = await orderModel.create({
      userId,
      items,
      amount,
      address,
      payment: false,
      status: "Order Processing",
      paymentMethod: "cod",
    });

    const user = await userModel.findByPk(userId);
    if (user) {
      await user.update({ cartData: {} });
    }

    return res.status(201).json({
      success: true,
      message: "COD order placed successfully",
      orderId: newOrder.id,
    });
  } catch (error) {
    console.error("Error placing COD order:", error);
    return res.status(500).json({ success: false, message: "Failed to place COD order" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!isValidId(orderId)) {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }

    const order = await orderModel.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    await order.destroy();
    return res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return res.status(500).json({ success: false, message: "Error deleting order" });
  }
};

export { placeOrder, verifyOrder, listOrders, userOrder, placeCodOrder, deleteOrder, updateOrderStatus };
