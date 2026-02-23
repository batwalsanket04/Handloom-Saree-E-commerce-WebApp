import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

//  Add item to cart
const addToCart = async (req, res) => {
  try {
    const { token } = req.headers; // token from frontend
    const { id } = req.body; // product ID from frontend

    if (!token) {
      return res.json({ success: false, message: "No token provided" });
    }

    // decode token to get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    let userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (!cartData[id]) {
      cartData[id] = 1;
    } else {
      cartData[id] += 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error adding to cart" });
  }
};

// ✅ Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { token } = req.headers;
    const { id } = req.body;

    if (!token) {
      return res.json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    let userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    if (cartData[id] > 0) {
      cartData[id] -= 1;
      if (cartData[id] === 0) delete cartData[id];
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Removed from cart" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error removing from cart" });
  }
};

// ✅ Get user cart
const getCart = async (req, res) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    let userData = await userModel.findById(userId);
    res.json({ success: true, cartData: userData.cartData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching cart" });
  }
};


export { addToCart, removeFromCart, getCart };
