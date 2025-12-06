import express from 'express';
import favoriteController from '../controllers/favoriteController.js';
import { authenticate } from '../middlewares/auth.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/favorites
 * @desc    Get user favorites
 * @access  Private
 */
router.get('/', asyncHandler(favoriteController.getFavorites));

/**
 * @route   POST /api/favorites
 * @desc    Add to favorites
 * @access  Private
 */
router.post('/', asyncHandler(favoriteController.addFavorite));

/**
 * @route   DELETE /api/favorites/:productId
 * @desc    Remove from favorites
 * @access  Private
 */
router.delete('/:productId', asyncHandler(favoriteController.removeFavorite));

export default router;
