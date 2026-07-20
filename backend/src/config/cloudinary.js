import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

// Ensure local uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads', 'resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Disk Storage Configuration (Local Fallback & Reliable Storage)
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Configure Cloudinary if valid credentials exist
const isCloudinaryConfigured = process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== '1234567890';

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

export const uploadResume = multer({
  storage: diskStorage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

export { cloudinary, isCloudinaryConfigured };
