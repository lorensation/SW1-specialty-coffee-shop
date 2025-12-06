import express from 'express';
import userController from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';
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

export default router;
