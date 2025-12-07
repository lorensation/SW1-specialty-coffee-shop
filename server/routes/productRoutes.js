import express from 'express';
import productController from '../controllers/productController.js';
import { authenticate, authorize, optionalAuth } from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import {
  createProductValidation,
  updateProductValidation,
  paginationValidation,
  uuidValidation
} from '../middlewares/validators.js';

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Public
 */
router.get(
  '/',
  optionalAuth,
  paginationValidation,
  validate,
  asyncHandler(productController.getAllProducts)
);

/**
 * @route   GET /api/products/featured
 * @desc    Get featured products
 * @access  Public
 */
router.get(
  '/featured',
  asyncHandler(productController.getFeaturedProducts)
);

/**
 * @route   GET /api/products/category/:category
 * @desc    Get products by category
 * @access  Public
 */
router.get(
  '/category/:category',
  asyncHandler(productController.getProductsByCategory)
);

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get(
  '/:id',
  uuidValidation,
  validate,
  asyncHandler(productController.getProductById)
);

// ... (GET routes)

/**
 * @route   POST /api/products
 * @desc    Create product (admin only)
 * @access  Private/Admin
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  createProductValidation,
  validate,
  asyncHandler(productController.createProduct)
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product (admin only)
 * @access  Private/Admin
 */
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  uuidValidation,
  updateProductValidation,
  validate,
  asyncHandler(productController.updateProduct)
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product (admin only)
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  uuidValidation,
  validate,
  asyncHandler(productController.deleteProduct)
);

/**
 * @route   PATCH /api/products/:id/stock
 * @desc    Update product stock (admin only)
 * @access  Private/Admin
 */
router.patch(
  '/:id/stock',
  authenticate,
  authorize('admin'),
  uuidValidation,
  validate,
  asyncHandler(productController.updateStock)
);

export default router;
