import { supabase, supabaseAdmin, handleSupabaseError } from '../config/database.js';

/**
 * Product Model
 * Handles all product-related database operations
 */

class ProductModel {
  /**
   * Get all products with optional filtering
   */
  static async getAll({ 
    page = 1, 
    limit = 20, 
    category = null, 
    isActive = true,
    isFeatured = null,
    search = null 
  }) {
    try {
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      if (isActive !== null) {
        query = query.eq('is_active', isActive);
      }
      
      if (isFeatured !== null) {
        query = query.eq('is_featured', isFeatured);
      }
      
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
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
   * Get products by category
   */
  static async getByCategory(category) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }
  
  /**
   * Get product by ID
   */
  static async getById(id) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          opinions(
            id,
            rating,
            title,
            comment,
            created_at,
            users(name, avatar_url)
          )
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
   * Create new product (admin only)
   */
  static async create(productData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .insert([productData])
        .select()
        .single();
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }
  
  /**
   * Update product (admin only)
   */
  static async update(id, updates) {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
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
   * Delete product (soft delete)
   */
  static async delete(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .update({ is_active: false })
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
   * Update stock quantity
   */
  static async updateStock(id, quantity) {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .update({ stock_quantity: quantity })
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
   * Get featured products
   */
  static async getFeatured(limit = 6) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .limit(limit);
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }
}

export default ProductModel;
