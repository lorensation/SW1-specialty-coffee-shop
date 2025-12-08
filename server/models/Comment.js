import { supabase, supabaseAdmin, handleSupabaseError } from '../config/database.js';

/**
 * Comment Model
 * Handles comment/review operations
 */

class CommentModel {
    /**
     * Create a new comment
     */
    static async create(commentData) {
        try {
            const { data, error } = await supabaseAdmin
                .from('comments')
                .insert([{
                    ...commentData,
                    status: 'approved', // Default status
                    type: commentData.type || 'opinion' // Default type
                }])
                .select(`
                    *,
                    users (
                        id,
                        name,
                        avatar_url
                    )
                `)
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            return { success: false, error: handleSupabaseError(error) };
        }
    }

    /**
     * Get all comments
     * @param {boolean} isAdmin - If true, returns all comments. If false, returns only approved.
     */
    static async getAll(isAdmin = false) {
        try {
            let query = supabase
                .from('comments')
                .select(`
                    *,
                    users (
                        id,
                        name,
                        avatar_url
                    )
                `)
                .order('created_at', { ascending: false });

            if (!isAdmin) {
                query = query.eq('status', 'approved');
            }

            const { data, error } = await query;

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            return { success: false, error: handleSupabaseError(error) };
        }
    }

    /**
     * Update comment status
     */
    static async updateStatus(id, status) {
        try {
            const { data, error } = await supabaseAdmin
                .from('comments')
                .update({ status })
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
     * Delete a comment
     */
    static async delete(id) {
        try {
            const { error } = await supabaseAdmin
                .from('comments')
                .delete()
                .eq('id', id);

            if (error) throw error;

            return { success: true };
        } catch (error) {
            return { success: false, error: handleSupabaseError(error) };
        }
    }
}

export default CommentModel;
