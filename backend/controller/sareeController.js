import sareeModel from "../models/sareeModel.js";
import fs from "fs";
import path from "path";

export const addSaree = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const saree = await sareeModel.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      image: req.file.filename,
    });

    res.status(200).json({
      success: true,
      message: "Saree added successfully",
      data: saree,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Add saree failed",
    });
  }
};

export const listSaree = async (req, res) => {
  try {
    const sarees = await sareeModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: sarees,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch sarees",
    });
  }
};

export const removeSaree = async (req, res) => {
  try {
    const saree = await sareeModel.findById(req.params.id);

    if (!saree) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const imagePath = path.join("uploads", saree.image);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await sareeModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};
