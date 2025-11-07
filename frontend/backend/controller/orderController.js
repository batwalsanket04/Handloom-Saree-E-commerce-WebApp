import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import Dotenv from "dotenv";
 

Dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const frontend_url = "https://handloom-saree-e-commerce-webapp-frontend-113c.onrender.com";

  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    await newOrder.save();

    // clear cart after placing order
    await userModel.findByIdAndUpdate(req.body.userId, { cartdata: {} });

    const line_items = req.body.items.map((val) => ({
      price_data: {
        currency: "inr",
        product_data: { name: val.name },
        unit_amount: val.price * 100,
      },
      quantity: val.quantity,
    }));

    // Add delivery fee
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 180 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log("Error placing order:", error.message);
    res.json({ success: false, message: error.message });
  }
};

 
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error verifying payment" });
  }
};
 
const userOrder = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching orders" });
  }
};

 
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching all orders" });
  }
};

 
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating order",
    });
  }
};

 
const placeCodOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment: false, // COD means not paid yet
      status: "Pending",
      paymentMethod: "cod",
    });

    await newOrder.save();

    // Clear user's cart after placing order
    await userModel.findByIdAndUpdate(userId, { cartdata: {} });

    //  Send success response
    res.status(200).json({
      success: true,
      message: "COD order placed successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Error placing COD order:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to place COD order" });
  }
};


export { placeOrder, verifyOrder, listOrders, userOrder, placeCodOrder };
