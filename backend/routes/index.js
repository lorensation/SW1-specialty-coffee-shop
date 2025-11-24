import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';
import reservationRoutes from './reservationRoutes.js';

const router = express.Router();

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * API Routes
 */
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/reservations', reservationRoutes);

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
