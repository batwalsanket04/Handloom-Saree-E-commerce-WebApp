import sareeModel from "../models/sareeModel.js";
import fs from "fs";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";

/* ───────── helpers ───────── */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const handleError = (res, status, message, log = true) => {
  if (log) console.error(message);
  return res.status(status).json({ success: false, message });
};

/* ───────── Add New Saree (Admin/Seller) ───────── */
export const addSaree = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    // Validation
    if (!name || !description || !price || !category) {
      return handleError(res, 400, "Name, description, price, and category are required", false);
    }

    if (!req.file) {
      return handleError(res, 400, "Image is required", false);
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      return handleError(res, 400, "Price must be a positive number", false);
    }

    const numStock = Number(stock) || 1000;
    if (numStock < 0) {
      return handleError(res, 400, "Stock cannot be negative", false);
    }

    // Upload image to Cloudinary
    let image_field = null;
    let image_public_id = null;

    try {
      const uploadRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "paithani_sarees",
        resource_type: "auto",
      });
      image_field = uploadRes.secure_url;
      image_public_id = uploadRes.public_id;

      fs.unlink(req.file.path, (err) => {
        if (err) console.warn("Failed to remove local file:", err);
      });
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      return handleError(res, 500, "Image upload failed");
    }

    const saree = new sareeModel({
      name: name.trim(),
      description: description.trim(),
      price: numPrice,
      category: category.trim(),
      image: image_field,
      imagePublicId: image_public_id,
      stock: numStock,
      sellerId: req.userRole === "admin" ? req.body.sellerId || req.userId : req.userId,
    });

    await saree.save();

    res.status(201).json({
      success: true,
      message: "Saree added successfully",
      data: saree,
    });
  } catch (error) {
    return handleError(res, 500, "Server error while adding saree");
  }
};

/* ───────── List All Sarees (with pagination) ───────── */
export const listSaree = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [sarees, total] = await Promise.all([
      sareeModel.find({}).populate("sellerId", "name email").skip(skip).limit(limit).sort({ createdAt: -1 }),
      sareeModel.countDocuments(),
    ]);

    res.json({
      success: true,
      data: sarees,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return handleError(res, 500, "Error fetching sarees");
  }
};

/* ───────── Search Sarees ───────── */
export const searchSarees = async (req, res) => {
  try {
    const q = req.query.q || "";

    if (!q.trim()) {
      return res.json({ success: true, data: [] });
    }

    const regex = new RegExp(escapeRegex(q.trim()), "i");
    const results = await sareeModel
      .find({
        $or: [{ name: regex }, { category: regex }, { description: regex }],
      })
      .limit(50);

    res.json({ success: true, data: results });
  } catch (error) {
    return handleError(res, 500, "Search failed");
  }
};

/* ───────── Related Sarees ───────── */
export const relatedSarees = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !isValidObjectId(id)) {
      return handleError(res, 400, "Invalid or missing Saree ID", false);
    }

    const saree = await sareeModel.findById(id);
    if (!saree) {
      return handleError(res, 404, "Saree not found", false);
    }

    const related = await sareeModel
      .find({ category: saree.category, _id: { $ne: saree._id } })
      .limit(8);

    res.json({ success: true, data: related });
  } catch (error) {
    return handleError(res, 500, "Error fetching related sarees");
  }
};

/* ───────── Get Saree Details ───────── */
export const getSareeDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !isValidObjectId(id)) {
      return handleError(res, 400, "Invalid or missing Saree ID", false);
    }

    const saree = await sareeModel.findById(id).populate("sellerId", "name email");
    if (!saree) {
      return handleError(res, 404, "Saree not found", false);
    }

    res.json({ success: true, data: saree });
  } catch (error) {
    return handleError(res, 500, "Error fetching saree details");
  }
};

/* ───────── Update Saree (Admin/Seller) ───────── */
export const updateSaree = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock } = req.body;
    const userId = req.userId;
    const userRole = req.userRole;

    if (!id || !isValidObjectId(id)) {
      return handleError(res, 400, "Invalid or missing Saree ID", false);
    }

    const saree = await sareeModel.findById(id);
    if (!saree) {
      return handleError(res, 404, "Saree not found", false);
    }

    // Authorization
    if (userRole !== "admin" && saree.sellerId?.toString() !== userId) {
      return handleError(res, 403, "Unauthorized to update this saree", false);
    }

    // Update fields
    if (name) saree.name = name.trim();
    if (description) saree.description = description.trim();

    if (price !== undefined) {
      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice <= 0) {
        return handleError(res, 400, "Price must be a positive number", false);
      }
      saree.price = numPrice;
    }

    if (category) saree.category = category.trim();

    if (stock !== undefined) {
      const numStock = Number(stock);
      if (numStock < 0) {
        return handleError(res, 400, "Stock cannot be negative", false);
      }
      saree.stock = numStock;
    }

    // Handle image update
    if (req.file) {
      try {
        if (saree.imagePublicId) {
          await cloudinary.uploader.destroy(saree.imagePublicId);
        }
        const uploadRes = await cloudinary.uploader.upload(req.file.path, {
          folder: "paithani_sarees",
        });
        saree.image = uploadRes.secure_url;
        saree.imagePublicId = uploadRes.public_id;

        fs.unlink(req.file.path, (err) => {
          if (err) console.warn("Failed to remove local file:", err);
        });
      } catch (err) {
        console.error("Image update error:", err);
        return handleError(res, 500, "Image update failed");
      }
    }

    saree.updatedAt = new Date();
    await saree.save();

    res.json({
      success: true,
      message: "Saree updated successfully",
      data: saree,
    });
  } catch (error) {
    return handleError(res, 500, "Server error updating saree");
  }
};

/* ───────── Delete Saree (Admin/Seller) ───────── */
export const removeSaree = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;

    if (!id || !isValidObjectId(id)) {
      return handleError(res, 400, "Invalid or missing Saree ID", false);
    }

    const saree = await sareeModel.findById(id);
    if (!saree) {
      return handleError(res, 404, "Saree not found", false);
    }

    // Authorization
    if (userRole !== "admin" && saree.sellerId?.toString() !== userId) {
      return handleError(res, 403, "Unauthorized to delete this saree", false);
    }

    // Delete image from Cloudinary
    if (saree.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(saree.imagePublicId);
      } catch (err) {
        console.warn("Cloudinary delete warning:", err);
      }
    }

    await sareeModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Saree deleted successfully" });
  } catch (error) {
    return handleError(res, 500, "Server error deleting saree");
  }
};

/* ───────── Get Sarees by Seller (Seller Dashboard) ───────── */
export const getSareesBySeller = async (req, res) => {
  try {
    const sellerId = req.userId;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [sarees, total] = await Promise.all([
      sareeModel.find({ sellerId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
      sareeModel.countDocuments({ sellerId }),
    ]);

    res.json({
      success: true,
      data: sarees,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return handleError(res, 500, "Error fetching seller sarees");
  }
};

