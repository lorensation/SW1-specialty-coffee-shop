import express from 'express';
import userController from '../controllers/userController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

const router = express.Router();

/**
 * @route   POST /api/users/avatar
 * @desc    Upload user avatar
 * @access  Private
 */


router.post(
    '/avatar',
    authenticate,
    userController.upload.single('avatar'),
    asyncHandler(userController.uploadAvatar)
);

router.delete(
    '/avatar',
    authenticate,
    asyncHandler(userController.deleteAvatar)
);

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin)
 * @access  Private/Admin
 */
router.get(
    '/',
    authenticate,
    authorize('admin'),
    asyncHandler(userController.getAllUsers)
);

/**
 * @route   PATCH /api/users/:id/role
 * @desc    Update user role (Admin)
 * @access  Private/Admin
 */
router.patch(
    '/:id/role',
    authenticate,
    authorize('admin'),
    asyncHandler(userController.updateUserRole)
);

/**
 * @route   PATCH /api/users/:id/status
 * @desc    Update user status (Admin)
 * @access  Private/Admin
 */
router.patch(
    '/:id/status',
    authenticate,
    authorize('admin'),
    asyncHandler(userController.updateUserStatus)
);

export default router;
