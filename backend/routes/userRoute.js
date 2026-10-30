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
userRouter.get("/verify-token", ...userAuth, verifyToken);
userRouter.post("/refresh-token", validate(refreshTokenSchema), refreshToken);
userRouter.post("/logout", validate(logoutSchema), logout);

// Admin routes (authenticated + admin role)
userRouter.get("/list", ...adminAuth, getAllUsers);
userRouter.delete("/:userId", ...adminAuth, deleteUser);
userRouter.put("/:userId/role", ...adminAuth, validate(updateUserRoleSchema), updateUserRole);

export default userRouter;