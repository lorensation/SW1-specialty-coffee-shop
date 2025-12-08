/**
 * Error Handler Middleware
 * Centralized error handling for the application
 */

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Not Found error handler
 */
export const notFound = (req, res, next) => {
  const error = new ApiError(404, `Route not found: ${req.originalUrl}`);
  next(error);
};

/**
 * Global error handler
 */
export const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  
  // Set default status code
  if (!statusCode) {
    statusCode = 500;
  }
  
  // Development environment: send full error details
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      statusCode,
    });
    
    return res.status(statusCode).json({
      success: false,
      message,
      error: {
        statusCode,
        message: err.message,
        stack: err.stack,
      },
    });
  }
  
  // Production environment: send minimal error details
  console.error('Error:', {
    message: err.message,
    statusCode,
  });
  
  // Don't expose internal errors in production
  if (!err.isOperational) {
    message = 'Internal server error';
  }
  
  res.status(statusCode).json({
    success: false,
    message,
  });
};

/**
 * Async handler wrapper
 * Wraps async route handlers to catch errors
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default {
  ApiError,
  notFound,
  errorHandler,
  asyncHandler,
};
