import express from "express";
import { userAuth } from "../middlewere/rbac.js";
import { getWishlist, addToWishlist, removeFromWishlist } from "../controller/userController.js";
import validate from "../middlewere/validate.middleware.js";
import { wishlistItemSchema } from "../Validator/wishlist.validator.js";

const router = express.Router();

router.get("/", ...userAuth, getWishlist);
router.post("/add", ...userAuth, validate(wishlistItemSchema), addToWishlist);
router.post("/remove", ...userAuth, validate(wishlistItemSchema), removeFromWishlist);

export default router;