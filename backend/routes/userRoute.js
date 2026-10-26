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
} from "../controller/userController.js";
import authMiddleware, { authorizeAdmin } from "../middlewere/auth.js";
import { logout, refreshToken } from "../controller/authController.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin-login", adminLogin);

// Protected routes
userRouter.get("/profile", authMiddleware, getProfile);
userRouter.get("/verify-token", authMiddleware, verifyToken);
userRouter.post("/refresh-token",refreshToken)
userRouter.post("/logout",logout)

// Admin routes
userRouter.get("/list", authMiddleware, authorizeAdmin, getAllUsers);
userRouter.delete("/:userId", authMiddleware, authorizeAdmin, deleteUser);
userRouter.put("/:userId/role", authMiddleware, authorizeAdmin, updateUserRole);

export default userRouter;
