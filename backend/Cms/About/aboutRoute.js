import express from "express";
import {
  getAbout,
  updateAbout,
} from "../../Cms/About/aboutController.js";

import upload from "../../uploads/Upload.js";
import { adminAuth } from "../../middlewere/rbac.js";

const aboutRouter = express.Router();

// Public
aboutRouter.get("/", getAbout);

// Admin
aboutRouter.put(
  "/update",
  ...adminAuth,
  upload.single("image"),
  updateAbout
);

export default aboutRouter;