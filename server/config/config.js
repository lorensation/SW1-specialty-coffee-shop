import dotenv from 'dotenv';

dotenv.config();

/**
 * Application Configuration - Simplified
 * Centralized configuration management
 */
const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Supabase configuration
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
  },

  // Cookie configuration
  cookie: {
    secret: process.env.COOKIE_SECRET || 'your-secret-key-change-in-production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },

  // Email configuration
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || 'Royal Coffee <noreply@royalcoffee.com>',
  },

  // CORS configuration
  cors: {
    origin: process.env.NODE_ENV === 'development'
      ? (origin, callback) => callback(null, true) // Allow any origin in dev
      : (process.env.FRONTEND_URL || 'http://localhost:5173'),
    credentials: true,
  },

  // Pagination defaults
  pagination: {
    defaultPage: 1,
    defaultLimit: 20,
    maxLimit: 100,
  },
};

// Validate required configuration
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_KEY',
];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

export default config;
