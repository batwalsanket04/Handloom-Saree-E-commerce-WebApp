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
import { userAuth, adminAuth, authorizeRoles } from "../middlewere/rbac.js";
import validate from "../middlewere/validate.middleware.js";
import { addSareeSchema, updateSareeSchema } from "../Validator/saree.validator.js";

const router = express.Router();

// Public routes
router.get("/list", listSaree);
router.get("/search", searchSarees);
router.get("/related/:id", relatedSarees);

// Admin routes
router.post("/add", ...adminAuth, upload.single("image"), validate(addSareeSchema), addSaree);
router.delete("/remove/:id", ...adminAuth, removeSaree);

// Seller routes (admin or seller)
const sellerAuth = [...userAuth, authorizeRoles("admin", "seller")];
router.post("/seller/add", ...sellerAuth, upload.single("image"), validate(addSareeSchema), addSaree);
router.put("/seller/:id", ...sellerAuth, upload.single("image"), validate(updateSareeSchema), updateSaree);
router.delete("/seller/remove/:id", ...sellerAuth, removeSaree);
router.get("/seller/list", ...sellerAuth, getSareesBySeller);

router.get("/:id", getSareeDetails);

export default router;