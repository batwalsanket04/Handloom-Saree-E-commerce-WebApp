import express from "express";
import authMiddleware from "../middlewere/auth.js";
import { getWishlist, addToWishlist, removeFromWishlist } from "../controller/userController.js";
import validate from "../middlewere/validate.middleware.js";
import { wishlistItemSchema } from "../Validator/wishlist.validator.js";

const router = express.Router();

router.get("/", authMiddleware, getWishlist);
router.post("/add", authMiddleware, validate(wishlistItemSchema), addToWishlist);
router.post("/remove", authMiddleware, validate(wishlistItemSchema), removeFromWishlist);

export default router;
