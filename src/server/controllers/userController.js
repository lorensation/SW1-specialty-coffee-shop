import multer from 'multer';
import path from 'path';
import { supabaseAdmin } from '../config/database.js';
import User from '../models/User.js';

// Configure multer storage (Memory Storage for Supabase Upload)
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
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

    const file = req.file;
    const fileExt = path.extname(file.originalname);
    const fileName = `${req.user.id}-${Date.now()}${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin
      .storage
      .from('avatars')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from('avatars')
      .getPublicUrl(fileName);

    // Update user in database
    const updatedUser = await User.update(req.user.id, { avatar_url: publicUrl });

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatar_url: updatedUser.avatar_url
      }
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    next(error);
  }
};

export const deleteAvatar = async (req, res, next) => {
  try {
    // Get current user to find the file path
    const user = await User.findById(req.user.id);

    if (user.avatar_url) {
      // Extract filename from URL
      // URL format: https://.../storage/v1/object/public/avatars/filename.jpg
      const urlParts = user.avatar_url.split('/');
      const fileName = urlParts[urlParts.length - 1];

      // Delete from Supabase Storage
      const { error } = await supabaseAdmin
        .storage
        .from('avatars')
        .remove([fileName]);

      if (error) {
        console.error('Error deleting avatar from storage:', error);
        // Continue to update DB even if storage delete fails
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

/**
 * Get all users (Admin)
 * GET /api/users
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role } = req.query;

    const result = await User.getAll({
      page: parseInt(page),
      limit: parseInt(limit),
      role
    });

    res.json({
      success: true,
      data: result.users,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user role (Admin)
 * PATCH /api/users/:id/role
 */
export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const updatedUser = await User.update(id, { role });

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user status (Admin)
 * PATCH /api/users/:id/status
 */
/**
 * Update user profile (Self)
 * PUT /api/users/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters long'
      });
    }

    const updatedUser = await User.update(req.user.id, { name });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const updatedUser = await User.update(id, { is_active });

    res.json({
      success: true,
      message: `User ${is_active ? 'activated' : 'suspended'} successfully`,
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

export default {
  upload,
  uploadAvatar,
  deleteAvatar,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  updateProfile
};
