import sareeModel from "../models/sareeModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import { Op } from "sequelize";

const isValidId = (id) => Number.isSafeInteger(Number(id)) && Number(id) > 0;

const handleError = (res, status, message, log = true) => {
  if (log) console.error(message);
  return res.status(status).json({ success: false, message });
};

export const addSaree = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !price || !category) {
      return handleError(res, 400, "Name, price, and category are required", false);
    }

    if (!req.file) {
      return handleError(res, 400, "Image is required", false);
    }

    const numPrice = Number(price);
    if (Number.isNaN(numPrice) || numPrice <= 0) {
      return handleError(res, 400, "Price must be a positive number", false);
    }

    const numStock = stock === undefined || stock === "" ? 1000 : Number(stock);
    if (!Number.isInteger(numStock) || numStock < 0) {
      return handleError(res, 400, "Stock cannot be negative", false);
    }

    let imageField = null;
    let imagePublicId = null;

    try {
      const uploadRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "paithani_sarees",
        resource_type: "auto",
      });

      imageField = uploadRes.secure_url;
      imagePublicId = uploadRes.public_id;

      fs.unlink(req.file.path, (err) => {
        if (err) console.warn("Failed to remove local file:", err);
      });
    } catch (err) {
      console.error("Cloudinary upload error:", err.message);
      imageField = `http://localhost:4000/images/${req.file.filename}`;
      imagePublicId = null;
    }

    const saree = await sareeModel.create({
      name: String(name).trim(),
      description: description ? String(description).trim() : "No description provided",
      price: numPrice,
      category: String(category).trim(),
      image: imageField,
      imagePublicId,
      stock: numStock,
      sellerId: req.userId && Number.isInteger(Number(req.userId)) ? Number(req.userId) : null,
    });

    return res.status(201).json({
      success: true,
      message: "Saree added successfully",
      data: saree,
    });
  } catch (error) {
    console.error("Error adding saree:", error);
    return handleError(res, 500, `Server error while adding saree: ${error.message}`);
  }
};

export const listSaree = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const { count, rows } = await sareeModel.findAndCountAll({
      include: [{ model: userModel, as: "seller", attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return res.json({
      success: true,
      data: rows,
      pagination: { page, limit, total: count, pages: Math.ceil(count / limit) },
    });
  } catch (error) {
    console.error("Error fetching sarees:", error);
    return handleError(res, 500, "Error fetching sarees");
  }
};

export const searchSarees = async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();

    if (!q) {
      return res.json({ success: true, data: [] });
    }

    const results = await sareeModel.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${q}%` } },
          { category: { [Op.iLike]: `%${q}%` } },
          { description: { [Op.iLike]: `%${q}%` } },
        ],
      },
      limit: 50,
      order: [["createdAt", "DESC"]],
    });

    return res.json({ success: true, data: results });
  } catch (error) {
    console.error("Search failed:", error);
    return handleError(res, 500, "Search failed");
  }
};

export const relatedSarees = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return handleError(res, 400, "Invalid or missing Saree ID", false);
    }

    const saree = await sareeModel.findByPk(id);
    if (!saree) {
      return handleError(res, 404, "Saree not found", false);
    }

    const related = await sareeModel.findAll({
      where: {
        category: saree.category,
        id: { [Op.ne]: saree.id },
      },
      limit: 8,
      order: [["createdAt", "DESC"]],
    });

    return res.json({ success: true, data: related });
  } catch (error) {
    console.error("Error fetching related sarees:", error);
    return handleError(res, 500, "Error fetching related sarees");
  }
};

export const getSareeDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return handleError(res, 400, "Invalid or missing Saree ID", false);
    }

    const saree = await sareeModel.findByPk(id, {
      include: [{ model: userModel, as: "seller", attributes: ["id", "name", "email"] }],
    });

    if (!saree) {
      return handleError(res, 404, "Saree not found", false);
    }

    return res.json({ success: true, data: saree });
  } catch (error) {
    console.error("Error fetching saree details:", error);
    return handleError(res, 500, "Error fetching saree details");
  }
};

export const updateSaree = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock } = req.body;
    const userId = req.userId;
    const userRole = req.userRole;

    if (!isValidId(id)) {
      return handleError(res, 400, "Invalid or missing Saree ID", false);
    }

    const saree = await sareeModel.findByPk(id);
    if (!saree) {
      return handleError(res, 404, "Saree not found", false);
    }

    if (userRole !== "admin" && String(saree.sellerId) !== String(userId)) {
      return handleError(res, 403, "Unauthorized to update this saree", false);
    }

    if (name) saree.name = String(name).trim();
    if (description) saree.description = String(description).trim();

    if (price !== undefined) {
      const numPrice = Number(price);
      if (Number.isNaN(numPrice) || numPrice <= 0) {
        return handleError(res, 400, "Price must be a positive number", false);
      }
      saree.price = numPrice;
    }

    if (category) saree.category = String(category).trim();

    if (stock !== undefined) {
      const numStock = Number(stock);
      if (!Number.isInteger(numStock) || numStock < 0) {
        return handleError(res, 400, "Stock cannot be negative", false);
      }
      saree.stock = numStock;
    }

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

    return res.json({
      success: true,
      message: "Saree updated successfully",
      data: saree,
    });
  } catch (error) {
    console.error("Error updating saree:", error);
    return handleError(res, 500, "Error updating saree");
  }
};

export const removeSaree = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return handleError(res, 400, "Invalid or missing Saree ID", false);
    }

    const saree = await sareeModel.findByPk(id);
    if (!saree) {
      return handleError(res, 404, "Saree not found", false);
    }

    if (req.userRole !== "admin" && String(saree.sellerId) !== String(req.userId)) {
      return handleError(res, 403, "Unauthorized to delete this saree", false);
    }

    if (saree.imagePublicId) {
      await cloudinary.uploader.destroy(saree.imagePublicId).catch(() => {});
    }

    await saree.destroy();
    return res.json({ success: true, message: "Saree removed successfully" });
  } catch (error) {
    console.error("Error removing saree:", error);
    return handleError(res, 500, "Error removing saree");
  }
};

export const getSareesBySeller = async (req, res) => {
  try {
    const where = req.userRole === "admin" ? {} : { sellerId: req.userId };

    const sarees = await sareeModel.findAll({
      where,
      include: [{ model: userModel, as: "seller", attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]],
    });

    return res.json({ success: true, data: sarees });
  } catch (error) {
    console.error("Error fetching seller sarees:", error);
    return handleError(res, 500, "Error fetching seller sarees");
  }
};
