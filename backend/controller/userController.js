import userModel from "../models/userModel.js";
import sareeModel from "../models/sareeModel.js";
import RefreshToken from "../models/refreshtoken.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken } from "../Utils/token.js";
import { generateAndStoreTokens, clearAuthCookies } from "../Utils/redisAuth.js";

const isValidId = (id) => Number.isSafeInteger(Number(id)) && Number(id) > 0;

const handleError = (res, status, message) => {
  return res.status(status).json({ success: false, message });
};

// Ensure admin user exists in database
const ensureAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminEmail || !adminPassword) {
    return null;
  }
  
  let adminUser = await userModel.findOne({ where: { email: adminEmail.toLowerCase() } });
  
  if (!adminUser) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    adminUser = await userModel.create({
      name: "Admin",
      email: adminEmail.toLowerCase(),
      password: hashedPassword,
      role: "admin"
    });
  } else if (adminUser.role !== "admin") {
    adminUser = await adminUser.update({ role: "admin" });
  }
  
  return adminUser;
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user) {
      return handleError(res, 401, "User doesn't exist");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return handleError(res, 401, "Invalid credentials");
    }

    // Generate tokens and store refresh token in Redis + PostgreSQL
    const { accessToken } = await generateAndStoreTokens(user, res);

    return res.json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch(error){

    console.error("Login failed:", error);

    return handleError(
        res,
        500,
        "Server error during login"
    );

}
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ensure admin user exists in DB
    const adminUser = await ensureAdminUser();
    
    if (!adminUser) {
      return handleError(res, 500, "Admin not configured");
    }

    // Verify credentials against env (not DB password, for security)
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return handleError(res, 401, "Invalid admin credentials");
    }

    // Generate tokens and store refresh token in Redis + PostgreSQL
    const { accessToken } = await generateAndStoreTokens(adminUser, res);

    return res.json({
      success: true,
      accessToken,
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return handleError(res, 500, "Server error");
  }
};

const registerUser = async(req,res)=>{

try{


const {
name,
email,
mobile,
password
}=req.body;


const normalizedEmail=email
?.trim()
.toLowerCase();


const existingUser =
await userModel.findOne({
where:{
email:normalizedEmail
}
});


if(existingUser){

return handleError(
res,
409,
"User already exists"
);

}


const hashedPassword =
await bcrypt.hash(password,10);


const user =
await userModel.create({

name:name.trim(),

email:normalizedEmail,

mobile,

password:hashedPassword,

role:"user"

});


// Generate tokens and store refresh token in Redis + PostgreSQL
const { accessToken } = await generateAndStoreTokens(user, res);


return res.status(201).json({

success:true,

accessToken:token,

user:{
id:user.id,
name:user.name,
email:user.email,
role:user.role
}

});


}
catch(error){

console.log(error);

return handleError(
res,
500,
"Server Error"
);

}

}
const getProfile = async (req, res) => {
  try {
    const user = await userModel.findByPk(req.userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return handleError(res, 404, "User not found");
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error("Profile error:", error);
    return handleError(res, 500, "Server error");
  }
};

const verifyToken = async (req, res) => {
  try {
    const user = await userModel.findByPk(req.userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.json({ success: true, valid: false, message: "User no longer exists" });
    }

    return res.json({
      success: true,
      valid: true,
      user: { id: user.id, _id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Verify token error:", error);
    return handleError(res, 401, "Invalid or expired token");
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    return res.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return handleError(res, 500, "Error fetching users");
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isValidId(userId)) {
      return handleError(res, 400, "User ID required");
    }

    const user = await userModel.findByPk(userId);
    if (!user) {
      return handleError(res, 404, "User not found");
    }

    await user.destroy();
    return res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return handleError(res, 500, "Error deleting user");
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!isValidId(userId)) {
      return handleError(res, 400, "User ID required");
    }

    const user = await userModel.findByPk(userId, { attributes: { exclude: ["password"] } });
    if (!user) {
      return handleError(res, 404, "User not found");
    }

    await user.update({ role });
    return res.json({ success: true, message: "User role updated", data: { ...user.toJSON(), id: user.id, _id: user.id } });
  } catch (error) {
    console.error("Error updating user role:", error);
    return handleError(res, 500, "Error updating user role");
  }
};

const getWishlist = async (req, res) => {
  try {
    const user = await userModel.findByPk(req.userId);
    if (!user) return handleError(res, 404, "User not found");

    const wishlist = await user.getSarees();
    return res.json({ success: true, wishlist });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return handleError(res, 500, "Error fetching wishlist");
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { sareeId } = req.body;

    const user = await userModel.findByPk(req.userId);
    if (!user) return handleError(res, 404, "User not found");

    const saree = await sareeModel.findByPk(sareeId);
    if (!saree) return handleError(res, 404, "Saree not found");

    const alreadyAdded = await user.hasSaree(saree);
    if (!alreadyAdded) {
      await user.addSaree(saree);
    }

    const wishlist = await user.getSarees();
    return res.json({ success: true, wishlist });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return handleError(res, 500, "Error adding to wishlist");
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { sareeId } = req.body;

    const user = await userModel.findByPk(req.userId);
    if (!user) return handleError(res, 404, "User not found");

    const saree = await sareeModel.findByPk(sareeId);
    if (!saree) return handleError(res, 404, "Saree not found");

    await user.removeSaree(saree);
    const wishlist = await user.getSarees();
    return res.json({ success: true, wishlist });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return handleError(res, 500, "Error removing from wishlist");
  }
};

export {
  loginUser,
  registerUser,
  getProfile,
  adminLogin,
  verifyToken,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};