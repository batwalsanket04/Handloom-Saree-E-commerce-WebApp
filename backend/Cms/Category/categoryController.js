import Category from "./categoryModel.js";
import cloudinary from "../../config/cloudinary.js";
import fs from "fs";
import { cmsCache } from "../../config/redis.js";

// CREATE
export const createCategory = async(req,res)=>{

try{

const {name}=req.body;


if(!req.file){

return res.status(400).json({

success:false,
message:"Image required"

});

}


// Upload image to Cloudinary

const uploadRes = await cloudinary.uploader.upload(
  req.file.path,
  {
    folder:"handloom_categories",
    resource_type:"auto"
  }
);


const category = await Category.create({

name,

image:uploadRes.secure_url,

imagePublicId:uploadRes.public_id

});

// Invalidate cache after creation
await cmsCache.invalidate("categories");


return res.json({

success:true,

message:"Category created",

category

});


}
catch(error){

console.log(error);

return res.status(500).json({

success:false,

message:error.message

});

}

};


// GET ALL
export const getCategories=async(req,res)=>{

try{
  // Try to get from Redis cache first
  const cachedCategories = await cmsCache.get("categories");
  if (cachedCategories) {
    console.log("Serving Categories from Redis cache");
    return res.json({
      success: true,
      categories: cachedCategories,
      cached: true,
    });
  }

const categories=await Category.findAll({

where:{
status:true
}

});

// Cache in Redis for 1 hour
await cmsCache.set("categories", categories, 3600);


res.json({
success:true,
categories,
cached: false
});


}catch(error){

res.status(500).json({
success:false,
message:error.message
});

}

};


// DELETE
export const deleteCategory = async(req,res)=>{

try{

const {id}=req.params;


const category = await Category.findByPk(id);


if(!category){

return res.status(404).json({
success:false,
message:"Category not found"
});

}


await category.destroy();

// Invalidate cache after deletion
await cmsCache.invalidate("categories");


res.json({

success:true,
message:"Category deleted"

});


}catch(error){

res.status(500).json({
success:false,
message:error.message
});

}

};


// UPDATE CATEGORY
export const updateCategory = async(req,res)=>{

try{

const {id}=req.params;
const {name}=req.body;


const category = await Category.findByPk(id);


if(!category){

return res.status(404).json({
success:false,
message:"Category not found"
});

}

let image = category.image;
let imagePublicId = category.imagePublicId;

if (req.file) {
  if (category.imagePublicId) {
    await cloudinary.uploader.destroy(category.imagePublicId);
  }

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "handloom_categories",
    resource_type: "auto"
  });

  image = result.secure_url;
  imagePublicId = result.public_id;

  fs.unlinkSync(req.file.path);
}


await category.update({

name:name || category.name,
image,
imagePublicId

});

// Invalidate cache after update
await cmsCache.invalidate("categories");


res.json({

success:true,
message:"Category updated",
category

});


}catch(error){

res.status(500).json({
success:false,
message:error.message
});

}

};