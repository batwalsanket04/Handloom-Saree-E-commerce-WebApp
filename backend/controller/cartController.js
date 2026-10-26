import userModel from "../models/userModel.js";
import sareeModel from "../models/sareeModel.js";

const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.body;

    const user = await userModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const product = await sareeModel.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const currentQty = user.cartData?.[id] || 0;
    if (Number(product.stock) <= Number(currentQty)) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`,
      });
    }

    const cartData = { ...(user.cartData || {}) };
    cartData[id] = (cartData[id] || 0) + 1;

    await user.update({ cartData });
    return res.json({ success: true, message: "Added to cart", cartData });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({ success: false, message: "Error adding to cart" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.body;

    const user = await userModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cartData = { ...(user.cartData || {}) };

    if (cartData[id] && cartData[id] > 0) {
      cartData[id] -= 1;
      if (cartData[id] === 0) delete cartData[id];
    } else {
      return res.status(400).json({ success: false, message: "Item not in cart" });
    }

    await user.update({ cartData });
    return res.json({ success: true, message: "Removed from cart", cartData });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return res.status(500).json({ success: false, message: "Error removing from cart" });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findByPk(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, cartData: user.cartData || {} });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ success: false, message: "Error fetching cart" });
  }
};

export { addToCart, removeFromCart, getCart };
