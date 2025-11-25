import AuthService from '../services/authService.js';
import { ApiError, asyncHandler } from '../middlewares/errorHandler.js';
import emailService from '../services/emailService.js';

/**
 * Auth Controller - Simplified
 * Handles authentication endpoints
 */

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  const { user, sessionToken } = await AuthService.register({
    email,
    password,
    name,
  });

  // Set session cookie
  res.cookie('session_token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Send welcome email
  try {
    await emailService.sendWelcomeEmail(user.email, user.name);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { user },
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, sessionToken } = await AuthService.login({ email, password });

  // Set session cookie
  res.cookie('session_token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({
    success: true,
    message: 'Login successful',
    data: { user },
  });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  const sessionToken = req.cookies.session_token;

  if (sessionToken) {
    await AuthService.logout(sessionToken);
  }

  // Clear cookie
  res.clearCookie('session_token');

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: { user: req.user },
  });
});
