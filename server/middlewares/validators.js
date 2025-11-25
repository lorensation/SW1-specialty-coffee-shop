import { body, param, query } from 'express-validator';

/**
 * Validation Schemas
 * Contains all validation rules for different endpoints
 */

// ===================================
// AUTH VALIDATIONS
// ===================================

export const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
];

export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
];

export const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

export const changePasswordValidation = [
  body('oldPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

// ===================================
// USER VALIDATIONS
// ===================================

export const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
];

export const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean'),
];

export const updatePreferencesValidation = [
  body('theme')
    .optional()
    .isIn(['light', 'dark'])
    .withMessage('Theme must be either light or dark'),
  body('notifications_enabled')
    .optional()
    .isBoolean()
    .withMessage('Notifications enabled must be a boolean'),
  body('language')
    .optional()
    .isIn(['es', 'en', 'fr'])
    .withMessage('Language must be es, en, or fr'),
];

// ===================================
// PRODUCT VALIDATIONS
// ===================================

export const createProductValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Product name must be between 2 and 255 characters'),
  body('description')
    .optional()
    .trim(),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isIn(['origen', 'bebida', 'postres', 'ediciones'])
    .withMessage('Category must be one of: origen, bebida, postres, ediciones'),
  body('origin')
    .optional()
    .trim()
    .isLength({ max: 255 }),
  body('tasting_notes')
    .optional()
    .trim(),
  body('stock_quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
  body('is_active')
    .optional()
    .isBoolean(),
  body('is_featured')
    .optional()
    .isBoolean(),
];

export const updateProductValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 }),
  body('price')
    .optional()
    .isFloat({ min: 0 }),
  body('category')
    .optional()
    .isIn(['origen', 'bebida', 'postres', 'ediciones']),
  body('stock_quantity')
    .optional()
    .isInt({ min: 0 }),
];

// ===================================
// RESERVATION VALIDATIONS
// ===================================

export const createReservationValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .matches(/^\+?[\d\s\-()]+$/)
    .withMessage('Must be a valid phone number'),
  body('num_people')
    .isInt({ min: 1, max: 20 })
    .withMessage('Number of people must be between 1 and 20'),
  body('reservation_date')
    .isDate()
    .withMessage('Must be a valid date')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        throw new Error('Reservation date cannot be in the past');
      }
      return true;
    }),
  body('reservation_time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Must be a valid time in HH:MM format'),
  body('message')
    .optional()
    .trim(),
];

export const updateReservationStatusValidation = [
  body('status')
    .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('Status must be one of: pending, confirmed, cancelled, completed'),
  body('admin_notes')
    .optional()
    .trim(),
];

// ===================================
// ORDER VALIDATIONS
// ===================================

export const createOrderValidation = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.product_id')
    .notEmpty()
    .withMessage('Product ID is required'),
  body('items.*.name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required'),
  body('items.*.price')
    .isFloat({ min: 0 })
    .withMessage('Product price must be a positive number'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('subtotal')
    .isFloat({ min: 0 })
    .withMessage('Subtotal must be a positive number'),
  body('tax')
    .isFloat({ min: 0 })
    .withMessage('Tax must be a positive number'),
  body('total')
    .isFloat({ min: 0 })
    .withMessage('Total must be a positive number'),
];

// ===================================
// OPINION VALIDATIONS
// ===================================

export const createOpinionValidation = [
  body('product_id')
    .notEmpty()
    .withMessage('Product ID is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 255 }),
  body('comment')
    .optional()
    .trim(),
];

export const createFeedOpinionValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 255 }),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Comment must be at least 10 characters'),
];

// ===================================
// FEED POST VALIDATIONS
// ===================================

export const createFeedPostValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 255 })
    .withMessage('Title must be between 5 and 255 characters'),
  body('content')
    .trim()
    .isLength({ min: 20 })
    .withMessage('Content must be at least 20 characters'),
  body('excerpt')
    .optional()
    .trim(),
  body('is_featured')
    .optional()
    .isBoolean(),
  body('is_published')
    .optional()
    .isBoolean(),
];

// ===================================
// PAGINATION VALIDATIONS
// ===================================

export const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

// ===================================
// ID VALIDATIONS
// ===================================

export const uuidValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid ID format'),
];

export default {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  updateProfileValidation,
  updatePreferencesValidation,
  createProductValidation,
  updateProductValidation,
  createReservationValidation,
  updateReservationStatusValidation,
  createOrderValidation,
  createOpinionValidation,
  createFeedOpinionValidation,
  createFeedPostValidation,
  paginationValidation,
  uuidValidation,
};
