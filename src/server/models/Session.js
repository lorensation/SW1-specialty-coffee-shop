import { supabaseAdmin } from '../config/database.js';
import crypto from 'crypto';

/**
 * Session Model - Simplified
 * Handles cookie-based session management
 */
class Session {
  /**
   * Create a new session
   */
  static async create(userId, expiresInDays = 7) {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const { data, error } = await supabaseAdmin
      .from('sessions')
      .insert([
        {
          user_id: userId,
          session_token: sessionToken,
          expires_at: expiresAt.toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Find session by token
   */
  static async findByToken(token) {
    const { data, error } = await supabaseAdmin
      .from('sessions')
      .select('*')
      .eq('session_token', token)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error) return null;
    return data;
  }

  /**
   * Delete session by token (logout)
   */
  static async deleteByToken(token) {
    const { error } = await supabaseAdmin
      .from('sessions')
      .delete()
      .eq('session_token', token);

    if (error) throw error;
    return true;
  }

  /**
   * Delete all user sessions (logout from all devices)
   */
  static async deleteAllUserSessions(userId) {
    const { error } = await supabaseAdmin
      .from('sessions')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }

  /**
   * Cleanup expired sessions
   */
  static async cleanupExpired() {
    const { error } = await supabaseAdmin
      .from('sessions')
      .delete()
      .lt('expires_at', new Date().toISOString());

    if (error) throw error;
    return true;
  }
}

export default Session;
