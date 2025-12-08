import { get, patch } from './api.js';

/**
 * User Service
 * Handles user-related API calls
 */

/**
 * Get all users (Admin)
 * @param {object} params - Query parameters (page, limit, role)
 * @returns {Promise<object>} List of users
 */
export const getAllUsers = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await get(`/users?${queryString}`);
};

/**
 * Update user role (Admin)
 * @param {string} id - User ID
 * @param {string} role - New role ('user' or 'admin')
 * @returns {Promise<object>} Updated user
 */
export const updateUserRole = async (id, role) => {
    return await patch(`/users/${id}/role`, { role });
};

/**
 * Update user status (Admin)
 * @param {string} id - User ID
 * @param {boolean} is_active - New status
 * @returns {Promise<object>} Updated user
 */
export const updateUserStatus = async (id, is_active) => {
    return await patch(`/users/${id}/status`, { is_active });
};

export default {
    getAllUsers,
    updateUserRole,
    updateUserStatus,
};
