import sareeModel from "../models/sareeModel.js";
import fs from 'fs';

// add saree items

const addSaree=async(req,res)=>{
  
    let image_filename=`${req.file.filename}`;

    const  saree =new sareeModel({
      name:req.body.name,
      description:req.body.description,
      price:req.body.price,
      category:req.body.category,
      image:image_filename
    })
    try{
        await saree.save();
        res.json({success:true,message:"Saree Added"})

    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// all saree list

const listSaree=async(req,res)=>{
  
    try{
         const sarees=await sareeModel.find({});
         res.json({success:true,data:sarees})
    }catch(error){
         console.log(error);
         res.json({success:false,message:"Error"})
    }
}

// remove food item

const removeSaree=async(req,res)=>
{

    try{
        const saree=await sareeModel.findById(req.body.id);
         fs.unlink(`uploads/${saree.image}`,()=>{})

         await sareeModel.findByIdAndDelete(req.body.id);
         res.json({success:true,message:"Food Removed"})
    }catch(error){
   console.log(error);
   res.json({success:false,message:"Remove failed"})

    }
}


export {addSaree,listSaree,removeSaree}