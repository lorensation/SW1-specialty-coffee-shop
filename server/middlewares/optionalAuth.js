import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import User from '../models/User.js';

/**
 * Optional Authentication Middleware
 * Checks for token, if present and valid, sets req.user.
 * If not present or invalid, just continues without setting req.user.
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return next();
        }

        try {
            const decoded = jwt.verify(token, config.jwtSecret);
            const user = await User.findById(decoded.id);

            if (user && user.is_active) {
                req.user = user;
            }
        } catch (err) {
            // Token invalid or expired, just ignore and proceed as guest
            console.log('Optional auth token invalid:', err.message);
        }

        next();
    } catch (error) {
        next();
    }
};
