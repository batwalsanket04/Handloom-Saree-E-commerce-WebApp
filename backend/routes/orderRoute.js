import express from "express";
import {
  placeOrder,
  verifyOrder,
  userOrder,
  listOrders,
  updateOrderStatus,
  placeCodOrder,
} from "../controller/orderController.js";

const orderRouter = express.Router();

/* USER */
orderRouter.post("/place", placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", userOrder);
orderRouter.post("/cod", placeCodOrder);

/* ADMIN */
orderRouter.get("/list", listOrders);
orderRouter.post("/update/:orderId", updateOrderStatus);

export default orderRouter;
