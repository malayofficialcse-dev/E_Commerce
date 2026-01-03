
import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

import { protect, admin } from "../middleware/authMiddleware";

dotenv.config();

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video/');
    return {
      folder: "ecommerce_products",
      resource_type: isVideo ? "video" : "image",
      allowed_formats: isVideo ? ["mp4", "webm", "ogg", "mov"] : ["jpg", "png", "jpeg", "webp"],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

const upload = multer({ storage: storage });

// Upload Route
router.post("/", protect, admin, upload.array("images", 10), (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const imageUrls = files.map((file) => file.path); // Cloudinary returns url in path
    
    res.status(200).json({ 
      success: true, 
      images: imageUrls,
      message: "Images uploaded successfully" 
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
});

export default router;
