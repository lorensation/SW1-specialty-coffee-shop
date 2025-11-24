import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { updateProfileValidation, updateUserValidation } from '../middlewares/validators.js';

const router = express.Router();

/**
 * User profile routes
 */
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, updateProfileValidation, validate, userController.updateProfile);

/**
 * Admin user management routes
 */
router.get('/', authenticate, authorize('admin'), userController.getAllUsers);
router.get('/:id', authenticate, authorize('admin'), userController.getUserById);
router.put('/:id', authenticate, authorize('admin'), updateUserValidation, validate, userController.updateUser);
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);

export default router;
