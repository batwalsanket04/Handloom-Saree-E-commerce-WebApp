import express from "express";
import authMiddleware from "../middlewere/auth.js";
import { getWishlist, addToWishlist, removeFromWishlist } from "../controller/userController.js";

const router = express.Router();

router.get("/", authMiddleware, getWishlist);
router.post("/add", authMiddleware, addToWishlist);
router.post("/remove", authMiddleware, removeFromWishlist);

export default router;
