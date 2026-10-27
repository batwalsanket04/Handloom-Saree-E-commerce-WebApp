import Category from "./categoryModel.js";
import cloudinary from "../../config/cloudinary.js";

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

const categories=await Category.findAll({

where:{
status:true
}

});


res.json({
success:true,
categories
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


await category.update({

name:name || category.name,

image:req.file 
? req.file.path 
: category.image

});


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