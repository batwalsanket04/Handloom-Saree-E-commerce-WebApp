import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import sareeModel from "../models/sareeModel.js";

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Product ID required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const product = await sareeModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check stock availability
    const currentQty = user.cartData?.[id] || 0;
    if (product.stock <= currentQty) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`,
      });
    }

    let cartData = user.cartData || {};
    cartData[id] = (cartData[id] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
    res.json({ success: true, message: "Added to cart", cartData });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Product ID required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = user.cartData || {};

    if (cartData[id] && cartData[id] > 0) {
      cartData[id] -= 1;
      if (cartData[id] === 0) delete cartData[id];
    } else {
      return res.status(400).json({ success: false, message: "Item not in cart" });
    }

    await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
    res.json({ success: true, message: "Removed from cart", cartData });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ success: false, message: "Error removing from cart" });
  }
};

// Get user cart
const getCart = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, cartData: user.cartData || {} });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ success: false, message: "Error fetching cart" });
  }
};

export { addToCart, removeFromCart, getCart };

