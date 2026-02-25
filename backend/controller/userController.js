import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import validator from "validator"


//logine user

const loginUser=async (req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"User Deosn't exist"})
        }

        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.json({success:false,message:"Invalid credentials"})
           
        }
        const token = createToken(user._id, user.role || "user");
         res.json({success:true,token,user:{_id:user._id,name:user.name,email:user.email,role:user.role}})
    }catch(error){
        console.log(error)
        res.json({success:false,message:'error'})
    }


}

// admin login - only with env credentials
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    const token = createToken("admin", "admin");

    res.json({
      success: true,
      token,
      user: {
        _id: "admin",
        name: "Admin",
        email: email,
        role: "admin",
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const createToken = (id, role = "user") => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};
// register user

const registerUser=async(req,res)=>{
const{name,password,email}=req.body;

try{
    // cheking user is already exists
    const exists=await userModel.findOne({email});
    if(exists){
        return res.json({success:false,message:"User already exists"})
    }
    //validating email format and strong password
    if(!validator.isEmail(email)){
        return res.json({success:false,message:"Please enter a valid email"})
    }
    //password length
    if(password.length<8){
        return res.json({success:false,message:"please enter strong password"})
    }
    //hasing user pass
    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(password,salt)

    const newUser=new userModel({
        name:name,
        email:email,
        password:hashedPassword
    })
   const user = await newUser.save()
   const token=createToken(user._id)
    res.json({success:true,token,user:{_id:user._id,name:user.name,email:user.email,role:user.role}});

} catch(error){
    console.log(error);
    res.json({success:false,message:"error"})
}  

}

// get profile (uses auth middleware)
const getProfile = async (req, res) => {
  try {
    // If admin
    if (req.userId === "admin") {
      return res.json({
        success: true,
        user: {
          _id: "admin",
          name: "Admin",
          email: process.env.ADMIN_EMAIL,
          role: "admin",
        },
      });
    }

    const user = await userModel.findById(req.userId).select("-password");

    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Wishlist endpoints
const getWishlist = async (req, res) => {
    try {
        const user = req.user || (await userModel.findById(req.body.userId));
        if (!user) return res.json({ success: false, message: "User not found" });
        await user.populate("wishlist");
        res.json({ success: true, wishlist: user.wishlist });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error fetching wishlist" });
    }
};

const addToWishlist = async (req, res) => {
    try {
        const { sareeId } = req.body;
        if (!sareeId) return res.json({ success: false, message: "sareeId required" });
        const user = req.user || (await userModel.findById(req.body.userId));
        if (!user) return res.json({ success: false, message: "User not found" });
        if (!user.wishlist) user.wishlist = [];
        const exists = user.wishlist.map((id) => id.toString()).includes(sareeId.toString());
        if (!exists) {
            user.wishlist.push(sareeId);
            await user.save();
        }
        await user.populate("wishlist");
        res.json({ success: true, wishlist: user.wishlist });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error adding to wishlist" });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const { sareeId } = req.body;
        if (!sareeId) return res.json({ success: false, message: "sareeId required" });
        const user = req.user || (await userModel.findById(req.body.userId));
        if (!user) return res.json({ success: false, message: "User not found" });
        user.wishlist = (user.wishlist || []).filter((id) => id.toString() !== sareeId.toString());
        await user.save();
        await user.populate("wishlist");
        res.json({ success: true, wishlist: user.wishlist });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error removing from wishlist" });
    }
};

// Verify token endpoint - validates JWT token
const verifyToken = async (req, res) => {
    try {
        // If we reach here, authMiddleware has already validated the token
        // req.userId and req.userRole are set by authMiddleware
        
        if (req.userId === "admin" && req.userRole === "admin") {
            // Admin token is valid
            return res.json({
                success: true,
                valid: true,
                user: {
                    _id: "admin",
                    name: "Admin",
                    email: process.env.ADMIN_EMAIL,
                    role: "admin"
                }
            });
        }

        // Check if user still exists in database
        const user = await userModel.findById(req.userId).select("-password");
        if (!user) {
            return res.json({
                success: true,
                valid: false,
                message: "User no longer exists"
            });
        }

        // Check if user has admin role
        if (user.role !== "admin") {
            return res.json({
                success: true,
                valid: false,
                message: "Admin access required"
            });
        }

        res.json({
            success: true,
            valid: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Verify token error:", error);
        res.status(401).json({
            success: false,
            valid: false,
            message: "Invalid or expired token"
        });
    }
};

export {loginUser,registerUser,getProfile,getWishlist,addToWishlist,removeFromWishlist,adminLogin,verifyToken}
