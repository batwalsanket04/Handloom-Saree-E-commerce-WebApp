import { name } from "ejs";
import mongoose from "mongoose";
import { type } from "os";

const sareeSchema=new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:String,required:true},
    category:{type:String,required:true},
    image:{type:String,required:true}

    
})
const sareeModel= mongoose.models.saree || mongoose.model("saree",sareeSchema)


export default sareeModel;