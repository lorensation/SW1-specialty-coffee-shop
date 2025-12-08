import FavoriteModel from '../models/Favorite.js';

/**
 * Favorite Controller
 */

/**
 * Add to favorites
 * POST /api/favorites
 */
export const addFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        const result = await FavoriteModel.add(userId, productId);

        if (!result.success) {
            return res.status(result.error?.status || 400).json({
                success: false,
                message: result.error?.message || 'Failed to add favorite'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Added to favorites'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Remove from favorites
 * DELETE /api/favorites/:productId
 */
export const removeFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const result = await FavoriteModel.remove(userId, productId);

        if (!result.success) {
            return res.status(result.error?.status || 400).json({
                success: false,
                message: result.error?.message || 'Failed to remove favorite'
            });
        }

        res.json({
            success: true,
            message: 'Removed from favorites'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get user favorites
 * GET /api/favorites
 */
export const getFavorites = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const result = await FavoriteModel.getByUserId(userId);

        if (!result.success) {
            return res.status(result.error?.status || 400).json({
                success: false,
                message: result.error?.message || 'Failed to fetch favorites'
            });
        }

        res.json({
            success: true,
            data: result.data
        });
    } catch (error) {
        next(error);
    }
};

export default {
    addFavorite,
    removeFavorite,
    getFavorites
};
