// routes/sareeRouter.js
import express from "express";
import { addSaree, listSaree, removeSaree } from "../controller/sareeController.js";
import upload from "../middlewere/uploads/Upload.js";

const router = express.Router();

// Add saree with image upload
router.post("/add", upload.single("image"), addSaree);

// List sarees
router.get("/list", listSaree);

// Remove saree
router.delete("/remove", removeSaree);

export default router;
