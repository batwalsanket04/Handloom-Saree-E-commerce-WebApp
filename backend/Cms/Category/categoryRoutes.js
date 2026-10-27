import express from "express";

import {
createCategory,
getCategories,
deleteCategory,
updateCategory
}
from "./categoryController.js";
import authMiddleware from "../../middlewere/auth.js";
import allowRoles from "../../middlewere/role.middleware.js"
import upload from "../../uploads/Upload.js";
 


const router=express.Router();



router.post(
  "/create",
 authMiddleware,
  allowRoles("admin"),
  upload.single("image"),
  createCategory
);



router.get(
"/list",
getCategories
);



router.delete(
"/:id",
deleteCategory
);
 

router.put(
"/update/:id",
upload.single("image"),
updateCategory
);



export default router;