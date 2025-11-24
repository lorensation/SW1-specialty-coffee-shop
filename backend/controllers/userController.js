import User from '../models/User.js';
import { ApiError, asyncHandler } from '../middlewares/errorHandler.js';

/**
 * User Controller - Simplified
 * Handles user management endpoints
 */

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json({
    success: true,
    data: { user },
  });
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const updates = {};
  if (name) updates.name = name;
  if (email) updates.email = email;

  const user = await User.update(req.user.id, updates);

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user },
  });
});

/**
 * @route   GET /api/users
 * @desc    Get all users (admin)
 * @access  Private (Admin)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const role = req.query.role;

  const result = await User.getAll({ page, limit, role });

  res.json({
    success: true,
    data: result,
  });
});

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID (admin)
 * @access  Private (Admin)
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json({
    success: true,
    data: { user },
  });
});

/**
 * @route   PUT /api/users/:id
 * @desc    Update user (admin)
 * @access  Private (Admin)
 */
export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, is_active } = req.body;

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;
  if (role !== undefined) updates.role = role;
  if (is_active !== undefined) updates.is_active = is_active;

  const user = await User.update(req.params.id, updates);

  res.json({
    success: true,
    message: 'User updated successfully',
    data: { user },
  });
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (admin)
 * @access  Private (Admin)
 */
export const deleteUser = asyncHandler(async (req, res) => {
  await User.delete(req.params.id);

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});
