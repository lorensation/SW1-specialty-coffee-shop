import { supabaseAdmin } from '../config/database.js';
import bcrypt from 'bcryptjs';

/**
 * User Model - Simplified
 * Handles user authentication and management
 */
class User {
  /**
   * Create a new user
   */
  static async create({ email, password, name, role = 'user' }) {
    const passwordHash = await bcrypt.hash(password, 10);

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          email: email.toLowerCase(),
          password_hash: passwordHash,
          name,
          role,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, email, name, role, is_active, created_at, avatar_url')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  /**
   * Find user by ID with password (for authentication)
   */
  static async findByIdWithPassword(id) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error) return null;
    return data;
  }

  /**
   * Verify password
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Update user
   */
  static async update(id, updates) {
    // If password is being updated, hash it
    if (updates.password) {
      updates.password_hash = await bcrypt.hash(updates.password, 10);
      delete updates.password;
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', id)
      .select('id, email, name, role, is_active, created_at, avatar_url')
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete user
   */
  static async delete(id) {
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  /**
   * Get all users (admin)
   */
  static async getAll({ page = 1, limit = 20, role = null }) {
    let query = supabaseAdmin
      .from('users')
      .select('id, email, name, role, is_active, created_at', { count: 'exact' });

    if (role) {
      query = query.eq('role', role);
    }

    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      users: data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
  /**
   * Save password reset token
   */
  static async saveResetToken(email, token, expires) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        reset_password_token: token,
        reset_password_expires: expires,
      })
      .eq('email', email.toLowerCase())
      .select('id, email, name')
      .single();

    if (error) return null;
    return data;
  }

  /**
   * Find user by reset token
   */
  static async findByResetToken(token) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('reset_password_token', token)
      .gt('reset_password_expires', new Date().toISOString())
      .single();

    if (error) return null;
    return data;
  }
}

export default User;
