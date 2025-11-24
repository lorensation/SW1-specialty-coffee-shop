import { supabase, supabaseAdmin, handleSupabaseError } from '../config/database.js';

/**
 * Reservation Model
 * Handles all reservation-related database operations
 */

class ReservationModel {
  /**
   * Create a new reservation
   */
  static async create(reservationData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('reservations')
        .insert([{
          ...reservationData,
          status: 'pending'
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }
  
  /**
   * Get all reservations with filtering
   */
  static async getAll({ 
    page = 1, 
    limit = 20, 
    status = null,
    userId = null,
    date = null 
  }) {
    try {
      let query = supabaseAdmin
        .from('reservations')
        .select(`
          *,
          users(name, email)
        `, { count: 'exact' });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      if (date) {
        query = query.eq('reservation_date', date);
      }
      
      const { data, error, count } = await query
        .order('reservation_date', { ascending: false })
        .order('reservation_time', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);
      
      if (error) throw error;
      
      return {
        success: true,
        data,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }
  
  /**
   * Get reservation by ID
   */
  static async getById(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('reservations')
        .select(`
          *,
          users(name, email, phone)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }
  
  /**
   * Get user reservations
   */
  static async getByUserId(userId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('reservations')
        .select('*')
        .eq('user_id', userId)
        .order('reservation_date', { ascending: false });
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }
  
  /**
   * Update reservation status
   */
  static async updateStatus(id, status, adminNotes = null) {
    try {
      const updates = { status };
      if (adminNotes) {
        updates.admin_notes = adminNotes;
      }
      
      const { data, error } = await supabaseAdmin
        .from('reservations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }
  
  /**
   * Update reservation
   */
  static async update(id, updates) {
    try {
      const { data, error } = await supabaseAdmin
        .from('reservations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }
  
  /**
   * Cancel reservation
   */
  static async cancel(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }
  
  /**
   * Check availability for a specific date and time
   */
  static async checkAvailability(date, time) {
    try {
      const { data, error } = await supabaseAdmin
        .from('reservations')
        .select('num_people')
        .eq('reservation_date', date)
        .eq('reservation_time', time)
        .in('status', ['pending', 'confirmed']);
      
      if (error) throw error;
      
      const totalPeople = data.reduce((sum, r) => sum + r.num_people, 0);
      const maxCapacity = 50; // Configure this as needed
      
      return {
        success: true,
        data: {
          available: totalPeople < maxCapacity,
          currentOccupancy: totalPeople,
          maxCapacity,
          remainingSpots: maxCapacity - totalPeople
        }
      };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }
}

export default ReservationModel;
