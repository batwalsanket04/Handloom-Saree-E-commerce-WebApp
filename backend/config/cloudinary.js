import { v2 as cloudinary } from "cloudinary";
import 'dotenv/config';

// Configure Cloudinary with proper settings
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Log Cloudinary configuration status
console.log("Cloudinary configured with cloud_name:", process.env.CLOUDINARY_CLOUD_NAME);

export default cloudinary;
