import express from "express"

import { addSaree,listSaree, removeSaree} from "../controller/sareeController.js"
import multer from "multer"
import { Upload } from "lucide-react";


const sareeRouter=express.Router();
//image storage engine
const storage=multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
       return cb(null,`${Date.now()}${file.originalname}`)
    }
})
const upload=multer({storage:storage})
sareeRouter.post("/add",upload.single("image"),addSaree)
sareeRouter.get("/list",listSaree)
sareeRouter.post("/remove",removeSaree);





export default sareeRouter;