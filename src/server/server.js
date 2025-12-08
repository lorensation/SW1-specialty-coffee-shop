import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import config from './config/config.js';
import { testConnection } from './config/database.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';
import { initSocket } from './services/socketService.js';

const app = express();

// ========================================
// MIDDLEWARE SETUP
// ========================================

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging middleware
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing middleware
app.use(cookieParser(config.cookie.secret));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// ========================================
// ROUTES
// ========================================

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Royal Coffee API Server',
    version: '1.0.0',
    environment: config.env,
    documentation: '/api/docs',
    health: '/api/health'
  });
});

// ========================================
// ERROR HANDLING
// ========================================

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ========================================
// SERVER STARTUP
// ========================================

const startServer = async () => {
  try {
    // Test database connection
    console.log('🔍 Testing database connection...');
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Please check your Supabase configuration.');
      process.exit(1);
    }

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize Socket.io
    initSocket(server);

    // Start server
    const PORT = config.port;
    server.listen(PORT, () => {
      console.log('');
      console.log('========================================');
      console.log('  🚀 Royal Coffee API Server Started');
      console.log('========================================');
      console.log(`  Environment: ${config.env}`);
      console.log(`  Port: ${PORT}`);
      console.log(`  URL: http://localhost:${PORT}`);
      console.log(`  API: http://localhost:${PORT}/api`);
      console.log(`  Health: http://localhost:${PORT}/api/health`);
      console.log('========================================');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Start the server
startServer();

export default app;
