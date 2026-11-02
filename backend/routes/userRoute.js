import express from "express";
import {
  loginUser,
  registerUser,
  getProfile,
  adminLogin,
  verifyToken,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  updateProfile,
  changePassword,
  getAddresses,
  addAddress,
  removeAddress,
  getPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  getTransactions,
  getRefunds,
} from "../controller/userController.js";
import { userAuth, adminAuth } from "../middlewere/rbac.js";
import { logout, refreshToken } from "../controller/authController.js";
import validate from "../middlewere/validate.middleware.js";
import {
  adminLoginSchema,
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  registerSchema,
  updateUserRoleSchema,
} from "../Validator/user.validator.js";

import apiLimiter from "../middlewere/rate.limiter.js";
const userRouter = express.Router();

// Public routes
userRouter.post("/register", apiLimiter, validate(registerSchema), registerUser);
userRouter.post("/login", apiLimiter, validate(loginSchema), loginUser);
userRouter.post("/admin-login", apiLimiter, validate(adminLoginSchema), adminLogin);

// Protected routes (authenticated users)
userRouter.get("/profile", ...userAuth, getProfile);
userRouter.put("/profile", ...userAuth, updateProfile);
userRouter.put("/change-password", ...userAuth, changePassword);
userRouter.get("/verify-token", ...userAuth, verifyToken);
userRouter.post("/refresh-token", validate(refreshTokenSchema), refreshToken);
userRouter.post("/logout", validate(logoutSchema), logout);

// Address routes
userRouter.get("/addresses", ...userAuth, getAddresses);
userRouter.post("/addresses", ...userAuth, addAddress);
userRouter.delete("/addresses/:addressId", ...userAuth, removeAddress);

// Payment method routes
userRouter.get("/payment-methods", ...userAuth, getPaymentMethods);
userRouter.post("/payment-methods", ...userAuth, addPaymentMethod);
userRouter.delete("/payment-methods/:methodId", ...userAuth, removePaymentMethod);

// Transaction routes
userRouter.get("/transactions", ...userAuth, getTransactions);

// Refund routes
userRouter.get("/refunds", ...userAuth, getRefunds);

// Wishlist routes
userRouter.get("/wishlist", ...userAuth, getWishlist);
userRouter.post("/wishlist/add", ...userAuth, addToWishlist);
userRouter.post("/wishlist/remove", ...userAuth, removeFromWishlist);

// Admin routes (authenticated + admin role)
userRouter.get("/list", ...adminAuth, getAllUsers);
userRouter.delete("/:userId", ...adminAuth, deleteUser);
userRouter.put("/:userId/role", ...adminAuth, validate(updateUserRoleSchema), updateUserRole);

export default userRouter;