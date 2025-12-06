import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/User.js';

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/avatars';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Rename file to avoid collisions: user_id-timestamp.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

/**
 * Upload User Avatar
 * POST /api/users/avatar
 */
export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Construct public URL for the file
    // Assuming server serves 'uploads' directory at /uploads
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Update user in database
    const updatedUser = await User.update(req.user.id, { avatar_url: avatarUrl });

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatar_url: updatedUser.avatar_url
      }
    });
  } catch (error) {
    // Delete uploaded file if database update fails
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file after failed update:', err);
      });
    }
    next(error);
  }
};

export const deleteAvatar = async (req, res, next) => {
  try {
    // Get current user to find the file path
    const user = await User.findById(req.user.id);

    if (user.avatar_url) {
      // Extract filename from URL
      const filename = user.avatar_url.split('/').pop();
      const filePath = path.join('uploads/avatars', filename);

      // Delete file if it exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Update user record
      await User.update(req.user.id, { avatar_url: null });
    }

    res.json({
      success: true,
      message: 'Avatar deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export default {
  upload,
  uploadAvatar,
  deleteAvatar
};
