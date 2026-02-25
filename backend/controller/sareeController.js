import sareeModel from "../models/sareeModel.js";
import fs from "fs";
import path from "path";
import cloudinary from "../config/cloudinary.js";

export const addSaree = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);

    const { name, description, price, category } = req.body;

    if (!name || !price) {
      return res.json({ success: false, message: "Name and price required" });
    }

    let image_field = null;
    let image_public_id = null;

    // If file uploaded locally, upload to Cloudinary (if configured)
    if (req.file) {
      const localPath = req.file.path || req.file.filename;
      try {
        const uploadRes = await cloudinary.uploader.upload(req.file.path || localPath, {
          folder: "paithani_sarees",
        });
        image_field = uploadRes.secure_url;
        image_public_id = uploadRes.public_id || null;
        // remove local file if exists
        if (req.file.path) {
          fs.unlink(req.file.path, (err) => {
            if (err) console.warn("Failed to remove local file:", err);
          });
        }
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        // fallback to local filename
        image_field = req.file.filename || null;
        image_public_id = null;
      }
    }

    const saree = new sareeModel({ name, description, price, category, image: image_field, imagePublicId: image_public_id });
    await saree.save();
    res.json({ success: true, message: "Saree Added", saree });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const listSaree = async (req, res) => {
  try {
    console.log("listSaree: querying database for sarees...");
    const sarees = await sareeModel.find({});
    //console.log(`listSaree: found ${sarees.length} sarees`);
    res.json({ success: true, data: sarees });
  } catch (error) {
    console.error("listSaree error:", error);
    res.status(500).json({ success: false, message: "Error fetching sarees", error: error.message });
  }
};

export const searchSarees = async (req, res) => {
  try {
    const q = req.query.q || "";
    if (!q) return res.json({ success: true, data: [] });
    const regex = new RegExp(q, "i");
    const results = await sareeModel.find({
      $or: [{ name: regex }, { category: regex }, { description: regex }],
    }).limit(50);
    res.json({ success: true, data: results });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Search failed" });
  }
};

export const relatedSarees = async (req, res) => {
  try {
    const id = req.params.id;
    const saree = await sareeModel.findById(id);
    if (!saree) return res.json({ success: false, data: [] });
    const related = await sareeModel.find({
      category: saree.category,
      _id: { $ne: saree._id },
    }).limit(8);
    res.json({ success: true, data: related });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Related fetch failed" });
  }
};

export const removeSaree = async (req, res) => {
  try {
    const sareeId = req.params.id;
    console.log("Saree ID to remove:", sareeId);

    const saree = await sareeModel.findById(sareeId);
    if (!saree) {
      return res.json({ success: false, message: "Saree not found" });
    }

    // If we have a stored Cloudinary public_id, use it for reliable deletion
    if (saree.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(saree.imagePublicId);
      } catch (err) {
        console.warn("Cloudinary delete failed for public_id:", saree.imagePublicId, err);
      }
    } else if (saree.image && saree.image.includes("res.cloudinary.com")) {
      // fallback: try to parse public_id from URL (best-effort)
      try {
        const parts = saree.image.split("/");
        const fileName = parts[parts.length - 1];
        const publicId = fileName.split(".")[0];
        await cloudinary.uploader.destroy(`paithani_sarees/${publicId}`);
      } catch (err) {
        console.warn("Cloudinary delete fallback failed:", err);
      }
    } else if (saree.image) {
      // remove local upload file from `uploads/` (multer stores there)
      const filePath = path.join(process.cwd(), "uploads", saree.image);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete image file:", err);
        else console.log("Image deleted:", saree.image);
      });
    }

    //Delete saree from database
    await sareeModel.findByIdAndDelete(sareeId);
    res.json({ success: true, message: "Saree removed successfully" });

  } catch (error) {
    console.error("Error removing saree:", error);
    res.json({ success: false, message: "Remove failed" });
  }
};
