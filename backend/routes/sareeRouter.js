// routes/sareeRouter.js
import express from "express";
import {
  addSaree,
  listSaree,
  removeSaree,
  searchSarees,
  relatedSarees,
  updateSaree,
  getSareeDetails,
  getSareesBySeller,
} from "../controller/sareeController.js";
import upload from "../uploads/Upload.js";
import authMiddleware, { authorizeAdmin, authorizeSeller } from "../middlewere/auth.js";

const router = express.Router();

// Public routes
router.get("/list", listSaree);
router.get("/search", searchSarees);
router.get("/related/:id", relatedSarees);
router.get("/:id", getSareeDetails);

// Admin only routes
router.post("/add", authMiddleware, authorizeAdmin, upload.single("image"), addSaree);
router.delete("/remove/:id", authMiddleware, authorizeAdmin, removeSaree);

// Seller routes (admin can also do)
router.post("/seller/add", authMiddleware, authorizeSeller, upload.single("image"), addSaree);
router.put("/seller/:id", authMiddleware, authorizeSeller, upload.single("image"), updateSaree);
router.delete("/seller/remove/:id", authMiddleware, authorizeSeller, removeSaree);
router.get("/seller/list", authMiddleware, authorizeSeller, getSareesBySeller);

export default router;
