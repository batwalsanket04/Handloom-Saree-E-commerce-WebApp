import express from "express"
import { userAuth } from "../middlewere/rbac.js";
import { addToCart, removeFromCart, getCart } from "../controller/cartController.js"
import validate from "../middlewere/validate.middleware.js";
import { cartItemSchema, emptyCartBodySchema } from "../Validator/cart.validator.js";

const cartRouter = express.Router();

cartRouter.post("/add", ...userAuth, validate(cartItemSchema), addToCart);
cartRouter.post("/remove", ...userAuth, validate(cartItemSchema), removeFromCart);
cartRouter.post("/get", ...userAuth, validate(emptyCartBodySchema), getCart);

export default cartRouter;