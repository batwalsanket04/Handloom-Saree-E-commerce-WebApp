import express from "express";
import { addSaree, listSaree, removeSaree } from "../controller/sareeController.js";
 import { upload } from "../uploads/Upload.js";
import authMiddleware from "../middlewere/auth.js";

const router = express.Router();

// Add saree (Admin)
router.post("/add", upload.single("image"), addSaree);

// List sarees (Public)
router.get("/list", listSaree);

// Remove saree (Admin)
router.delete("/remove/:id", removeSaree);

export default router;
