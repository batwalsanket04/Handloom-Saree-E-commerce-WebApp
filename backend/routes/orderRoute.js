import express from "express";
import authMiddleware, { authorizeAdmin } from "../middlewere/auth.js";
import { 
  placeOrder, 
  verifyOrder, 
  userOrder, 
  listOrders, 
  updateOrderStatus,
  placeCodOrder,
  deleteOrder,
} from "../controller/orderController.js";
import validate from "../middlewere/validate.middleware.js";
import {
  placeCodOrderSchema,
  placeOrderSchema,
  updateOrderStatusSchema,
  verifyOrderSchema,
} from "../Validator/order.validator.js";

const orderRouter = express.Router();

// Place orders
orderRouter.post("/place", authMiddleware, validate(placeOrderSchema), placeOrder);
orderRouter.post("/cod", authMiddleware, validate(placeCodOrderSchema), placeCodOrder);

// Verify payment
orderRouter.post("/verify", authMiddleware, validate(verifyOrderSchema), verifyOrder);

// Get user's orders
orderRouter.get("/userorders", authMiddleware, userOrder);

// Admin routes - List and manage orders
orderRouter.get("/list", authMiddleware, authorizeAdmin, listOrders);
orderRouter.post("/update/:orderId", authMiddleware, authorizeAdmin, validate(updateOrderStatusSchema), updateOrderStatus);
orderRouter.delete("/:orderId", authMiddleware, authorizeAdmin, deleteOrder);

export default orderRouter;
