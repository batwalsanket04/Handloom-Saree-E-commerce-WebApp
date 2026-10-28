import express from "express";
import { adminAuth } from "../middlewere/rbac.js";
import {
  getAllUsers,
  deleteUser,
  updateUserRole
} from "../controller/userController.js";

const adminRouter = express.Router();

// All admin routes require authentication + admin role
adminRouter.use(...adminAuth);

adminRouter.get(
  "/users",
  getAllUsers
);

adminRouter.delete(
  "/users/:userId",
  deleteUser
);

adminRouter.put(
  "/users/:userId/role",
  updateUserRole
);

export default adminRouter;