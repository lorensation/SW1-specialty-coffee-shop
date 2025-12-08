import express from 'express';
import commentController from '../controllers/commentController.js';
import { authenticate, optionalAuth } from '../middlewares/auth.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

const router = express.Router();

/**
 * @route   GET /api/comments
 * @desc    Get all comments (Admin sees all, User sees approved)
 * @access  Public (Optional Auth)
 */
router.get('/', optionalAuth, asyncHandler(commentController.getAllComments));

/**
 * @route   POST /api/comments
 * @desc    Create a new comment
 * @access  Private
 */
router.post('/', authenticate, asyncHandler(commentController.createComment));

/**
 * @route   PATCH /api/comments/:id/status
 * @desc    Update comment status (Approve/Hide)
 * @access  Private (Admin only)
 */
router.patch('/:id/status', authenticate, asyncHandler(commentController.updateCommentStatus));

/**
 * @route   DELETE /api/comments/:id
 * @desc    Delete a comment
 * @access  Private (Admin or Owner)
 */
router.delete('/:id', authenticate, asyncHandler(commentController.deleteComment));

export default router;
