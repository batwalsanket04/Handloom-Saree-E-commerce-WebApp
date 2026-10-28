import About from "./aboutModel.js";
import cloudinary from "../../config/cloudinary.js";
import fs from "fs";
import { cmsCache } from "../../config/redis.js";

const handleError = (res, status, message) => {
  return res.status(status).json({
    success: false,
    message,
  });
};

// ================= GET ABOUT =================

const getAbout = async (req, res) => {
  try {
    // Try to get from Redis cache first
    const cachedAbout = await cmsCache.get("about");
    if (cachedAbout) {
      console.log("Serving About from Redis cache");
      return res.json({
        success: true,
        about: cachedAbout,
        cached: true,
      });
    }

    // Fetch from database
    let about = await About.findOne();

    if (!about) {
      about = await About.create({
        title: "About Us",
        subtitle: "Elegant Drapes",
        description1:
          "Welcome to Elegant Drapes — where every thread tells a story of tradition, artistry, and timeless elegance.",
        description2:
          "Our passion lies in celebrating India's rich weaving heritage.",
        description3:
          "From vibrant Paithanis to graceful silks and minimal cottons.",
        description4:
          "We empower local weavers and promote sustainable fashion.",
        buttonText: "Explore Collection",
        buttonLink: "/collection",
      });
    }

    // Cache in Redis for 1 hour
    await cmsCache.set("about", about.toJSON ? about.toJSON() : about, 3600);

    return res.json({
      success: true,
      about,
      cached: false,
    });
  } catch (error) {
    console.log(error);
    return handleError(res, 500, "Failed to fetch about data");
  }
};

// ================= UPDATE ABOUT =================

const updateAbout = async (req, res) => {
  try {
    let about = await About.findOne();

    if (!about) {
      about = await About.create({});
    }

    let image = about.image;
    let imagePublicId = about.imagePublicId;

    if (req.file) {
      if (about.imagePublicId) {
        await cloudinary.uploader.destroy(about.imagePublicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "about",
      });

      image = result.secure_url;
      imagePublicId = result.public_id;

      fs.unlinkSync(req.file.path);
    }

    await about.update({
      title: req.body.title,
      subtitle: req.body.subtitle,
      description1: req.body.description1,
      description2: req.body.description2,
      description3: req.body.description3,
      description4: req.body.description4,
      buttonText: req.body.buttonText,
      buttonLink: req.body.buttonLink,
      image,
      imagePublicId,
    });

    // Invalidate cache after update
    await cmsCache.invalidate("about");

    return res.json({
      success: true,
      message: "About updated successfully",
      about,
    });
  } catch (error) {
    console.log(error);
    return handleError(res, 500, "Failed to update about");
  }
};

export {
  getAbout,
  updateAbout,
};