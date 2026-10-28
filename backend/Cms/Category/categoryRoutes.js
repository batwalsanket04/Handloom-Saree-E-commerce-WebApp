import express from "express";
import {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory
} from "./categoryController.js";
import { adminAuth } from "../../middlewere/rbac.js";
import upload from "../../uploads/Upload.js";

const router = express.Router();

// Admin only - create category
router.post(
  "/create",
  ...adminAuth,
  upload.single("image"),
  createCategory
);

// Public - list categories
router.get(
  "/list",
  getCategories
);

// Admin only - delete category
router.delete(
  "/:id",
  ...adminAuth,
  deleteCategory
);

// Admin only - update category
router.put(
  "/update/:id",
  ...adminAuth,
  upload.single("image"),
  updateCategory
);

export default router;