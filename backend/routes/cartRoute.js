import express from "express";
import authMiddleware from "../middlewere/auth.js";
import {
  addToCart,
  removeFromCart,
  getCart,
} from "../controller/cartController.js";

const cartRouter = express.Router();

// Cart actions (User must be logged in)
cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.post("/remove", authMiddleware, removeFromCart);
cartRouter.post("/get", authMiddleware, getCart);

export default cartRouter;
