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

const orderRouter = express.Router();

// Place orders
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/cod", authMiddleware, placeCodOrder);

// Verify payment
orderRouter.post("/verify", authMiddleware, verifyOrder);

// Get user's orders
orderRouter.get("/userorders", authMiddleware, userOrder);

// Admin routes - List and manage orders
orderRouter.get("/list", authMiddleware, authorizeAdmin, listOrders);
orderRouter.post("/update/:orderId", authMiddleware, authorizeAdmin, updateOrderStatus);
orderRouter.delete("/:orderId", authMiddleware, authorizeAdmin, deleteOrder);

export default orderRouter;
