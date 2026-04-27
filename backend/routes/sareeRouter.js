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
} from "../controller/sareeController.js";
import upload from "../uploads/Upload.js";
import authMiddleware, { authorizeAdmin, authorizeSeller } from "../middlewere/auth.js";

const router = express.Router();

// Public routes
router.get("/list", listSaree);
router.get("/search", searchSarees);
router.get("/related/:id", relatedSarees);
router.get("/:id", getSareeDetails);

// Admin/Seller routes - Protected
router.post("/add", authMiddleware, authorizeSeller, upload.single("image"), addSaree);
router.put("/:id", authMiddleware, authorizeSeller, upload.single("image"), updateSaree);
router.delete("/remove/:id", authMiddleware, authorizeSeller, removeSaree);

export default router;
