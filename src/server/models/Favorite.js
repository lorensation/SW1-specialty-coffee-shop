import { supabaseAdmin, handleSupabaseError } from '../config/database.js';

/**
 * Favorite Model
 * Handles favorite products operations
 */

class FavoriteModel {
    /**
     * Add a favorite
     */
    static async add(userId, productId) {
        try {
            const { data, error } = await supabaseAdmin
                .from('favorites')
                .insert([{ user_id: userId, product_id: productId }])
                .select()
                .single();

            if (error) {
                // Ignore duplicate key error (already favorited)
                if (error.code === '23505') {
                    return { success: true, message: 'Already in favorites' };
                }
                throw error;
            }

            return { success: true, data };
        } catch (error) {
            return { success: false, error: handleSupabaseError(error) };
        }
    }

    /**
     * Remove a favorite
     */
    static async remove(userId, productId) {
        try {
            const { error } = await supabaseAdmin
                .from('favorites')
                .delete()
                .eq('user_id', userId)
                .eq('product_id', productId);

            if (error) throw error;

            return { success: true };
        } catch (error) {
            return { success: false, error: handleSupabaseError(error) };
        }
    }

    /**
     * Get user favorites
     */
    static async getByUserId(userId) {
        try {
            // Join with products table to get product details
            // Note: This assumes a 'products' table exists. 
            // If products are hardcoded in frontend, we might need a different approach,
            // but usually there should be a products table.
            // Based on productController.js, there is a 'products' table.

            const { data, error } = await supabaseAdmin
                .from('favorites')
                .select(`
          product_id,
          products (*)
        `)
                .eq('user_id', userId);

            if (error) throw error;

            // Flatten the structure to return just the products
            const products = data.map(item => item.products);

            return { success: true, data: products };
        } catch (error) {
            return { success: false, error: handleSupabaseError(error) };
        }
    }
}

export default FavoriteModel;
