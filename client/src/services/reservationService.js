import { get, post, put, del } from './api.js';

/**
 * Reservation Service
 * Handles all reservation-related API calls
 */

/**
 * Create a new reservation
 * @param {object} reservationData - Reservation details
 * @returns {Promise<object>} Created reservation
 */
export const createReservation = async (reservationData) => {
  return await post('/reservations', reservationData);
};

/**
 * Get user's reservations
 * @returns {Promise<object>} User's reservations
 */
export const getUserReservations = async () => {
  return await get('/reservations');
};

/**
 * Get a single reservation by ID
 * @param {string} id - Reservation ID
 * @returns {Promise<object>} Reservation details
 */
export const getReservationById = async (id) => {
  return await get(`/reservations/${id}`);
};

/**
 * Update reservation status
 * @param {string} id - Reservation ID
 * @param {string} status - New status (pending, confirmed, cancelled, completed)
 * @returns {Promise<object>} Updated reservation
 */
export const updateReservationStatus = async (id, status) => {
  return await put(`/reservations/${id}/status`, { status });
};

/**
 * Cancel a reservation
 * @param {string} id - Reservation ID
 * @returns {Promise<object>} Cancelled reservation
 */
export const cancelReservation = async (id) => {
  return await del(`/reservations/${id}`);
};

/**
 * Check availability for a date/time
 * @param {string} date - Reservation date (YYYY-MM-DD)
 * @param {string} time - Reservation time (HH:MM)
 * @returns {Promise<object>} Availability info
 */
export const checkAvailability = async (date, time) => {
  return await get(`/reservations/availability?date=${date}&time=${time}`);
};

export default {
  createReservation,
  getUserReservations,
  getReservationById,
  updateReservationStatus,
  cancelReservation,
  checkAvailability,
};
