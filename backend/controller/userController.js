import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import validator from "validator"

/**
 * Login User
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User doesn't exist"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = createToken(user._id, user.role || "user");
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
};

/**
 * Admin Login - Hardcoded credentials
 */
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
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

/**
 * Create JWT Token
 */
const createToken = (id, role = "user") => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/**
 * Register User
 */
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;

  try {
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required"
      });
    }

    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email"
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword
    });

    const user = await newUser.save();
    const token = createToken(user._id, "user");

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration"
    });
  }
};

/**
 * Get User Profile
 */
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

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Verify Token - Check if token is valid
 */
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

/**
 * Get All Users (Admin Only)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users"
    });
  }
};

/**
 * Delete User (Admin Only)
 */
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID required"
      });
    }

    const user = await userModel.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user"
    });
  }
};

/**
 * Update User Role (Admin Only)
 */
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID required"
      });
    }

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role required"
      });
    }

    const validRoles = ["user", "seller", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "User role updated",
      data: user
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user role"
    });
  }
};

/**
 * Wishlist endpoints
 */
const getWishlist = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId)
      .populate("wishlist");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      wishlist: user.wishlist
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching wishlist"
    });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { sareeId } = req.body;

    if (!sareeId) {
      return res.status(400).json({
        success: false,
        message: "Saree ID required"
      });
    }

    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.wishlist) user.wishlist = [];

    const exists = user.wishlist.map((id) => id.toString()).includes(sareeId.toString());

    if (!exists) {
      user.wishlist.push(sareeId);
      await user.save();
    }

    await user.populate("wishlist");

    res.json({
      success: true,
      wishlist: user.wishlist
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Error adding to wishlist"
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { sareeId } = req.body;

    if (!sareeId) {
      return res.status(400).json({
        success: false,
        message: "Saree ID required"
      });
    }

    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.wishlist = (user.wishlist || []).filter((id) => id.toString() !== sareeId.toString());
    await user.save();
    await user.populate("wishlist");

    res.json({
      success: true,
      wishlist: user.wishlist
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Error removing from wishlist"
    });
  }
};

export {
  loginUser,
  registerUser,
  getProfile,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  adminLogin,
  verifyToken
};
