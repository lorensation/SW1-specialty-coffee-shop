import { createClient } from '@supabase/supabase-js';
import config from './config.js';

/**
 * Supabase Client Configuration
 * Creates and exports configured Supabase clients for different use cases
 */

// Public client (uses anon key, respects RLS)
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
);

// Admin client (uses service key, bypasses RLS)
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * Test database connection
 */
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

/**
 * Helper function to handle Supabase errors
 */
export const handleSupabaseError = (error) => {
  if (!error) return null;
  
  const errorMap = {
    '23505': { status: 409, message: 'Resource already exists' },
    '23503': { status: 400, message: 'Invalid reference' },
    '23502': { status: 400, message: 'Required field missing' },
    '22P02': { status: 400, message: 'Invalid input format' },
    'PGRST116': { status: 404, message: 'Resource not found' },
  };
  
  const code = error.code;
  const mapped = errorMap[code];
  
  if (mapped) {
    return {
      status: mapped.status,
      message: mapped.message,
      detail: error.message
    };
  }
  
  return {
    status: 500,
    message: 'Database error',
    detail: error.message
  };
};

export default supabase;
