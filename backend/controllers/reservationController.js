import ReservationModel from '../models/Reservation.js';
import emailService from '../services/emailService.js';

/**
 * Reservation Controller
 * Handles reservation/booking endpoints
 */

/**
 * Create reservation
 * POST /api/reservations
 */
export const createReservation = async (req, res, next) => {
  try {
    const reservationData = {
      ...req.body,
      user_id: req.user?.id || null
    };
    
    // Check availability
    const availability = await ReservationModel.checkAvailability(
      reservationData.reservation_date,
      reservationData.reservation_time
    );
    
    if (availability.success && !availability.data.available) {
      return res.status(400).json({
        success: false,
        message: 'Sorry, no tables available at this time',
        data: availability.data
      });
    }
    
    const result = await ReservationModel.create(reservationData);
    
    if (!result.success) {
      return res.status(result.error?.status || 400).json({
        success: false,
        message: result.error?.message || 'Failed to create reservation'
      });
    }
    
    // Send confirmation email
    await emailService.sendReservationConfirmation(result.data);
    
    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all reservations
 * GET /api/reservations
 */
export const getAllReservations = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, date } = req.query;
    
    // Regular users can only see their own reservations
    const userId = req.user.role === 'admin' ? null : req.user.id;
    
    const result = await ReservationModel.getAll({
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      userId,
      date
    });
    
    if (!result.success) {
      return res.status(result.error?.status || 400).json({
        success: false,
        message: result.error?.message || 'Failed to fetch reservations'
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
 * Get reservation by ID
 * GET /api/reservations/:id
 */
export const getReservationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await ReservationModel.getById(id);
    
    if (!result.success) {
      return res.status(result.error?.status || 404).json({
        success: false,
        message: result.error?.message || 'Reservation not found'
      });
    }
    
    // Check ownership (unless admin)
    if (req.user.role !== 'admin' && result.data.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
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
 * Get user reservations
 * GET /api/reservations/user/me
 */
export const getMyReservations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const result = await ReservationModel.getByUserId(userId);
    
    if (!result.success) {
      return res.status(result.error?.status || 400).json({
        success: false,
        message: result.error?.message || 'Failed to fetch reservations'
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
 * Update reservation status (admin only)
 * PATCH /api/reservations/:id/status
 */
export const updateReservationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;
    
    const result = await ReservationModel.updateStatus(id, status, admin_notes);
    
    if (!result.success) {
      return res.status(result.error?.status || 400).json({
        success: false,
        message: result.error?.message || 'Failed to update reservation'
      });
    }
    
    // Send notification email if confirmed
    if (status === 'confirmed') {
      await emailService.sendReservationConfirmation(result.data);
    }
    
    res.json({
      success: true,
      message: 'Reservation status updated successfully',
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update reservation
 * PUT /api/reservations/:id
 */
export const updateReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Check ownership (unless admin)
    const existing = await ReservationModel.getById(id);
    if (!existing.success) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }
    
    if (req.user.role !== 'admin' && existing.data.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const result = await ReservationModel.update(id, updates);
    
    if (!result.success) {
      return res.status(result.error?.status || 400).json({
        success: false,
        message: result.error?.message || 'Failed to update reservation'
      });
    }
    
    res.json({
      success: true,
      message: 'Reservation updated successfully',
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel reservation
 * DELETE /api/reservations/:id
 */
export const cancelReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check ownership (unless admin)
    const existing = await ReservationModel.getById(id);
    if (!existing.success) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }
    
    if (req.user.role !== 'admin' && existing.data.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const result = await ReservationModel.cancel(id);
    
    if (!result.success) {
      return res.status(result.error?.status || 400).json({
        success: false,
        message: result.error?.message || 'Failed to cancel reservation'
      });
    }
    
    res.json({
      success: true,
      message: 'Reservation cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Check availability
 * GET /api/reservations/availability
 */
export const checkAvailability = async (req, res, next) => {
  try {
    const { date, time } = req.query;
    
    if (!date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Date and time are required'
      });
    }
    
    const result = await ReservationModel.checkAvailability(date, time);
    
    if (!result.success) {
      return res.status(result.error?.status || 400).json({
        success: false,
        message: result.error?.message || 'Failed to check availability'
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
  createReservation,
  getAllReservations,
  getReservationById,
  getMyReservations,
  updateReservationStatus,
  updateReservation,
  cancelReservation,
  checkAvailability
};
