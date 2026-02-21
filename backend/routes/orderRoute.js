import express from "express";
import authMiddleware, { authorizeAdmin } from "../middlewere/auth.js";
import { 
  placeOrder, 
  verifyOrder, 
  userOrder, 
  listOrders, 
  updateOrderStatus ,
  placeCodOrder,
} from "../controller/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrder);
// list & update should be admin-protected
orderRouter.get("/list", authMiddleware, authorizeAdmin, listOrders);
orderRouter.post("/update/:orderId", authMiddleware, authorizeAdmin, updateOrderStatus);
orderRouter.post("/cod", authMiddleware, placeCodOrder);


export default orderRouter;
