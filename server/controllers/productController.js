import ProductModel from '../models/Product.js';

/**
 * Product Controller
 * Handles product catalog endpoints
 */

/**
 * Get all products
 * GET /api/products
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      isActive,
      isFeatured,
      search
    } = req.query;

    const result = await ProductModel.getAll({
      page: parseInt(page),
      limit: parseInt(limit),
      category,
      isActive: isActive !== undefined ? isActive === 'true' : true,
      isFeatured: isFeatured !== undefined ? isFeatured === 'true' : null,
      search
    });

    if (!result.success) {
      return res.status(result.error?.status || 400).json({
        success: false,
        message: result.error?.message || 'Failed to fetch products'
      });
    }

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get products by category
 * GET /api/products/category/:category
 */
export const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    const result = await ProductModel.getByCategory(category);

    if (!result.success) {
      return res.status(result.error?.status || 400).json({
        success: false,
        message: result.error?.message || 'Failed to fetch products'
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

/**
 * Get product by ID
 * GET /api/products/:id
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await ProductModel.getById(id);

    if (!result.success) {
      return res.status(result.error?.status || 404).json({
        success: false,
        message: result.error?.message || 'Product not found'
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

/**
 * Get featured products
 * GET /api/products/featured
 */
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;

    const result = await ProductModel.getFeatured(parseInt(limit));

    if (!result.success) {
      return res.status(result.error?.status || 400).json({
        success: false,
        message: result.error?.message || 'Failed to fetch featured products'
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

/**
 * Create product (admin only)
 * POST /api/products
 */
export const createProduct = async (req, res, next) => {
  try {
    const productData = req.body;

    const result = await ProductModel.create(productData);

    if (!result.success) {
      return res.status(result.error?.status || 400).json({
        success: false,
        message: result.error?.message || 'Failed to create product'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product (admin only)
 * PUT /api/products/:id
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const result = await ProductModel.update(id, updates);

    if (!result.success) {
      return res.status(result.error?.status || 400).json({
        success: false,
        message: result.error?.message || 'Failed to update product'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product (admin only)
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await ProductModel.delete(id);

    if (!result.success) {
      return res.status(result.error?.status || 400).json({
        success: false,
        message: result.error?.message || 'Failed to delete product'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product stock (admin only)
 * PATCH /api/products/:id/stock
 */
export const updateStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const result = await ProductModel.updateStock(id, quantity);

    if (!result.success) {
      return res.status(result.error?.status || 400).json({
        success: false,
        message: result.error?.message || 'Failed to update stock'
      });
    }

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock
};
