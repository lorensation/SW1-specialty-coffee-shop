import AuthService from '../services/authService.js';
import { ApiError } from './errorHandler.js';

/**
 * Authentication Middleware - Simplified
 * Uses cookie-based sessions
 */

/**
 * Authenticate user (required authentication)
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get session token from cookie
    const sessionToken = req.cookies.session_token;

    if (!sessionToken) {
      throw new ApiError(401, 'Authentication required');
    }

    // Validate session
    const user = await AuthService.validateSession(sessionToken);

    if (!user) {
      throw new ApiError(401, 'Invalid or expired session');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication (user data if available, but not required)
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const sessionToken = req.cookies.session_token;

    if (sessionToken) {
      const user = await AuthService.validateSession(sessionToken);
      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

/**
 * Authorize by role
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Insufficient permissions'));
    }

    next();
  };
};

/**
 * Check ownership (user can access their own resources)
 */
export const checkOwnership = (getUserId) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    // Get resource owner ID
    const resourceUserId = typeof getUserId === 'function' 
      ? getUserId(req) 
      : req.params.id || req.params.userId;

    if (req.user.id !== resourceUserId) {
      return next(new ApiError(403, 'Access denied'));
    }

    next();
  };
};
