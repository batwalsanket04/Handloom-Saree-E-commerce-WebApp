import userModel from "../models/userModel.js";

// ADD TO CART
const addToCart = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.userId;

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    cartData[id] = (cartData[id] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error adding to cart" });
  }
};

// REMOVE FROM CART
const removeFromCart = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.userId;

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    if (cartData[id]) {
      cartData[id] -= 1;
      if (cartData[id] <= 0) delete cartData[id];
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Removed from cart" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error removing from cart" });
  }
};

// GET CART
const getCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    res.json({ success: true, cartData:user});
  
  } catch (error) {
    res.json({ success: false, cartData: {} });
  }
};

export { addToCart, removeFromCart, getCart };
