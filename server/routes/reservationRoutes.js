import express from 'express';
import reservationController from '../controllers/reservationController.js';
import { authenticate, authorize, optionalAuth } from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import {
  createReservationValidation,
  updateReservationStatusValidation,
  paginationValidation,
  uuidValidation
} from '../middlewares/validators.js';

const router = express.Router();

/**
 * @route   POST /api/reservations
 * @desc    Create reservation
 * @access  Public/Private
 */
router.post(
  '/',
  optionalAuth,
  createReservationValidation,
  validate,
  asyncHandler(reservationController.createReservation)
);

/**
 * @route   GET /api/reservations
 * @desc    Get all reservations (admin sees all, user sees own)
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  paginationValidation,
  validate,
  asyncHandler(reservationController.getAllReservations)
);

/**
 * @route   GET /api/reservations/availability
 * @desc    Check availability for a date/time
 * @access  Public
 */
router.get(
  '/availability',
  asyncHandler(reservationController.checkAvailability)
);

/**
 * @route   GET /api/reservations/user/me
 * @desc    Get user's reservations
 * @access  Private
 */
router.get(
  '/user/me',
  authenticate,
  asyncHandler(reservationController.getMyReservations)
);

/**
 * @route   GET /api/reservations/:id
 * @desc    Get reservation by ID
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  uuidValidation,
  validate,
  asyncHandler(reservationController.getReservationById)
);

/**
 * @route   PUT /api/reservations/:id
 * @desc    Update reservation
 * @access  Private
 */
router.put(
  '/:id',
  authenticate,
  uuidValidation,
  validate,
  asyncHandler(reservationController.updateReservation)
);

/**
 * @route   PATCH /api/reservations/:id/status
 * @desc    Update reservation status (admin only)
 * @access  Private/Admin
 */
router.patch(
  '/:id/status',
  authenticate,
  authorize('admin'),
  uuidValidation,
  updateReservationStatusValidation,
  validate,
  asyncHandler(reservationController.updateReservationStatus)
);

/**
 * @route   DELETE /api/reservations/:id
 * @desc    Cancel reservation
 * @access  Private
 */
router.delete(
  '/:id',
  authenticate,
  uuidValidation,
  validate,
  asyncHandler(reservationController.cancelReservation)
);

export default router;
