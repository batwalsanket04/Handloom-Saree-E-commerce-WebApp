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
import validate from "../middlewere/validate.middleware.js";
import {
  adminLoginSchema,
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  registerSchema,
  updateUserRoleSchema,
} from "../Validator/user.validator.js";
const userRouter = express.Router();

// Public routes
userRouter.post("/register", validate(registerSchema), registerUser);
userRouter.post("/login", validate(loginSchema), loginUser);
userRouter.post("/admin-login", validate(adminLoginSchema), adminLogin);

// Protected routes
userRouter.get("/profile", authMiddleware, getProfile);
userRouter.get("/verify-token", authMiddleware, verifyToken);
userRouter.post("/refresh-token", validate(refreshTokenSchema), refreshToken);
userRouter.post("/logout", validate(logoutSchema), logout);

// Admin routes
userRouter.get("/list", authMiddleware, authorizeAdmin, getAllUsers);
userRouter.delete("/:userId", authMiddleware, authorizeAdmin, deleteUser);
userRouter.put("/:userId/role", authMiddleware, authorizeAdmin, validate(updateUserRoleSchema), updateUserRole);

export default userRouter;
