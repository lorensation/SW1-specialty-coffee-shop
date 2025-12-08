import { get, post, del, patch } from './api.js';

/**
 * Comment Service
 * Handles all comment-related API calls
 */

/**
 * Get all comments
 * @returns {Promise<object>} List of comments
 */
export const getAllComments = async () => {
    return await get('/comments');
};

/**
 * Create a new comment
 * @param {object} commentData - { content, rating }
 * @returns {Promise<object>} Created comment
 */
export const createComment = async (commentData) => {
    return await post('/comments', commentData);
};

/**
 * Delete a comment
 * @param {string} id - Comment ID
 * @returns {Promise<object>} Success response
 */
export const deleteComment = async (id) => {
    return await del(`/comments/${id}`);
};

/**
 * Update a comment's status
 * @param {string} id - Comment ID
 * @param {string} status - New status (e.g., 'approved', 'rejected')
 * @returns {Promise<object>} Updated comment
 */
export const updateCommentStatus = async (id, status) => {
    return await patch(`/comments/${id}/status`, { status });
};

export default {
    getAllComments,
    createComment,
    deleteComment,
    updateCommentStatus
};
