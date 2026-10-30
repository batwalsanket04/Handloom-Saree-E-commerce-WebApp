import express from "express";
import { userAuth, adminAuth } from "../middlewere/rbac.js";
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

// Place orders (authenticated users)
orderRouter.post("/place", ...userAuth, validate(placeOrderSchema), placeOrder);
orderRouter.post("/cod", ...userAuth, validate(placeCodOrderSchema), placeCodOrder);

// Verify payment (authenticated users)
orderRouter.post("/verify", ...userAuth, validate(verifyOrderSchema), verifyOrder);

// Get user's orders (authenticated users)
orderRouter.get("/userorders", ...userAuth, userOrder);

// Admin routes - List and manage orders
orderRouter.get("/list", ...adminAuth, listOrders);
orderRouter.post("/update/:orderId", ...adminAuth, validate(updateOrderStatusSchema), updateOrderStatus);
orderRouter.delete("/:orderId", ...adminAuth, deleteOrder);

export default orderRouter;