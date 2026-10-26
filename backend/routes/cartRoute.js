import express from "express"
import authMiddleware from "../middlewere/auth.js";
import { addToCart,removeFromCart,getCart } from "../controller/cartController.js"
import validate from "../middlewere/validate.middleware.js";
import { cartItemSchema, emptyCartBodySchema } from "../Validator/cart.validator.js";

const cartRouter=express.Router();

cartRouter.post("/add", authMiddleware, validate(cartItemSchema), addToCart);
cartRouter.post("/remove", authMiddleware, validate(cartItemSchema), removeFromCart);
cartRouter.post("/get", authMiddleware, validate(emptyCartBodySchema), getCart);

export default cartRouter;
