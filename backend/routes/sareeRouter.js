// routes/sareeRouter.js
import express from "express";
import { addSaree, listSaree, removeSaree } from "../controller/sareeController.js";
import upload from "../uploads/Upload.js";
import { searchSarees, relatedSarees } from "../controller/sareeController.js";
import authMiddleware, { authorizeAdmin } from "../middlewere/auth.js";

const router = express.Router();

// Add saree with image upload (admin only)
router.post("/add", authMiddleware, authorizeAdmin, upload.single("image"), addSaree);

// List sarees
router.get("/list", listSaree);

// Search sarees
router.get("/search", searchSarees);

// Related products
router.get("/related/:id", relatedSarees);

// Remove saree (admin only)
router.delete("/remove/:id", authMiddleware, authorizeAdmin, removeSaree);

export default router;
