import sareeModel from "../models/sareeModel.js";
import fs from "fs";
import path from "path";

export const addSaree = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);

    const { name, description, price, category } = req.body;

    if (!name || !price) {
      return res.json({ success: false, message: "Name and price required" });
    }

    const image_filename = req.file ? req.file.filename : null;

    const saree = new sareeModel({ name, description, price, category, image: image_filename });
    await saree.save();
    res.json({ success: true, message: "Saree Added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const listSaree = async (req, res) => {
  try {
    const sarees = await sareeModel.find({});
    res.json({ success: true, data: sarees });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching sarees" });
  }
};

export const removeSaree = async (req, res) => {
  try {
    const saree = await sareeModel.findById(req.body.id);
    if (!saree) return res.json({ success: false, message: "Saree not found" });

    if (saree.image) {
      const filePath = path.join(process.cwd(), "uploads", saree.image);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete image:", err);
      });
    }

    await sareeModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Saree Removed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Remove failed" });
  }
};
