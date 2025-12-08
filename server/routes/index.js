import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';
import reservationRoutes from './reservationRoutes.js';
import favoriteRoutes from './favoriteRoutes.js';
import commentRoutes from './commentRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes
router.use('/auth', authRoutes);

// Product routes
router.use('/products', productRoutes);

// Reservation routes
router.use('/reservations', reservationRoutes);

// Favorite routes
router.use('/favorites', favoriteRoutes);

// Comment routes
router.use('/comments', commentRoutes);

// Upload routes
router.use('/upload', uploadRoutes);

// User routes
router.use('/users', userRoutes);

/**
 * API Documentation endpoint
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Royal Coffee API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      reservations: '/api/reservations'
    },
    documentation: '/api/docs'
  });
});

export default router;
