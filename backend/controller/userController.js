import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

/* ───────── helpers ───────── */
const createToken = (id, role = "user") => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const handleError = (res, status, message) => {
  return res.status(status).json({ success: false, message });
};

/* ───────── Login User ───────── */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return handleError(res, 400, "Email and password are required");
    }

    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return handleError(res, 401, "User doesn't exist");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return handleError(res, 401, "Invalid credentials");
    }

    const token = createToken(user._id, user.role);
    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return handleError(res, 500, "Server error during login");
  }
};

/* ───────── Admin Login ───────── */
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return handleError(res, 400, "Email and password are required");
    }

    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return handleError(res, 401, "Invalid admin credentials");
    }

    const token = createToken("admin", "admin");
    res.json({
      success: true,
      token,
      user: { _id: "admin", name: "Admin", email, role: "admin" },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return handleError(res, 500, "Server error");
  }
};

/* ───────── Register User ───────── */
const registerUser = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    if (!name || !email || !password) {
      return handleError(res, 400, "Name, email, and password are required");
    }

    const exists = await userModel.findOne({ email: email.toLowerCase() });
    if (exists) {
      return handleError(res, 409, "User already exists");
    }

    if (!validator.isEmail(email)) {
      return handleError(res, 400, "Please enter a valid email");
    }

    if (password.length < 8) {
      return handleError(res, 400, "Password must be at least 8 characters");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user", // Security: never allow role selection on register
    });

    const user = await newUser.save();
    const token = createToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return handleError(res, 500, "Server error during registration");
  }
};

/* ───────── Get Profile ───────── */
const getProfile = async (req, res) => {
  try {
    if (req.userId === "admin" && req.userRole === "admin") {
      return res.json({
        success: true,
        user: { _id: "admin", name: "Admin", email: process.env.ADMIN_EMAIL, role: "admin" },
      });
    }

    const user = await userModel.findById(req.userId).select("-password");
    if (!user) {
      return handleError(res, 404, "User not found");
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Profile error:", error);
    return handleError(res, 500, "Server error");
  }
};

/* ───────── Verify Token (works for ALL roles) ───────── */
const verifyToken = async (req, res) => {
  try {
    if (req.userId === "admin" && req.userRole === "admin") {
      return res.json({
        success: true,
        valid: true,
        user: { _id: "admin", name: "Admin", email: process.env.ADMIN_EMAIL, role: "admin" },
      });
    }

    const user = await userModel.findById(req.userId).select("-password");
    if (!user) {
      return res.json({ success: true, valid: false, message: "User no longer exists" });
    }

    res.json({
      success: true,
      valid: true,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Verify token error:", error);
    return handleError(res, 401, "Invalid or expired token");
  }
};

/* ───────── Get All Users (Admin) ───────── */
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return handleError(res, 500, "Error fetching users");
  }
};

/* ───────── Delete User (Admin) ───────── */
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return handleError(res, 400, "User ID required");
    }

    const user = await userModel.findByIdAndDelete(userId);
    if (!user) {
      return handleError(res, 404, "User not found");
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return handleError(res, 500, "Error deleting user");
  }
};

/* ───────── Update User Role (Admin) ───────── */
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!userId) {
      return handleError(res, 400, "User ID required");
    }
    if (!role || !["user", "seller", "admin"].includes(role)) {
      return handleError(res, 400, "Valid role required (user, seller, admin)");
    }

    const user = await userModel.findByIdAndUpdate(userId, { role }, { new: true }).select("-password");
    if (!user) {
      return handleError(res, 404, "User not found");
    }

    res.json({ success: true, message: "User role updated", data: user });
  } catch (error) {
    console.error("Error updating user role:", error);
    return handleError(res, 500, "Error updating user role");
  }
};

/* ───────── Wishlist Endpoints ───────── */
const getWishlist = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) return handleError(res, 404, "User not found");
    await user.populate("wishlist");
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    console.error(error);
    return handleError(res, 500, "Error fetching wishlist");
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { sareeId } = req.body;
    if (!sareeId) return handleError(res, 400, "sareeId required");

    const user = await userModel.findById(req.userId);
    if (!user) return handleError(res, 404, "User not found");
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
    return handleError(res, 500, "Error adding to wishlist");
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { sareeId } = req.body;
    if (!sareeId) return handleError(res, 400, "sareeId required");

    const user = await userModel.findById(req.userId);
    if (!user) return handleError(res, 404, "User not found");

    user.wishlist = (user.wishlist || []).filter((id) => id.toString() !== sareeId.toString());
    await user.save();
    await user.populate("wishlist");
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    console.error(error);
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
