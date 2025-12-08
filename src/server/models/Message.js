import { supabaseAdmin } from '../config/database.js';

/**
 * Message Model
 * Handles chat message persistence
 */
class Message {
    /**
     * Create a new message
     * @param {object} data - { user_id, sender, message }
     */
    static async create({ user_id, sender, message }) {
        const { data, error } = await supabaseAdmin
            .from('messages')
            .insert([
                {
                    user_id,
                    sender,
                    message,
                    is_read: false
                },
            ])
            .select()
            .single();

        if (error) {
            console.error('Error creating message:', error);
            return { success: false, error };
        }
        return { success: true, data };
    }

    /**
     * Get chat history for a user
     * @param {string} user_id
     */
    static async getHistory(user_id) {
        const { data, error } = await supabaseAdmin
            .from('messages')
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching history:', error);
            return { success: false, error };
        }
        return { success: true, data };
    }

    /**
   * Get list of users with chat history
   */
    static async getActiveChats() {
        // This is a bit complex in Supabase/Postgres without a dedicated 'chats' table.
        // We want unique user_ids from messages.
        // A raw query or a distinct select is needed.

        // Approach: Get distinct user_ids from messages table
        const { data, error } = await supabaseAdmin
            .from('messages')
            .select('user_id, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching active chats:', error);
            return { success: false, error };
        }

        // Filter unique user_ids manually (since Supabase JS client distinct is limited)
        const uniqueUsers = [];
        const seenIds = new Set();

        for (const msg of data) {
            if (!seenIds.has(msg.user_id)) {
                seenIds.add(msg.user_id);
                uniqueUsers.push(msg.user_id);
            }
        }

        // Now fetch user details for these IDs
        if (uniqueUsers.length === 0) return { success: true, data: [] };

        const { data: users, error: userError } = await supabaseAdmin
            .from('users')
            .select('id, name, email')
            .in('id', uniqueUsers);

        if (userError) {
            console.error('Error fetching user details:', userError);
            return { success: false, error: userError };
        }

        return { success: true, data: users };
    }

    /**
     * Mark messages as read
     * @param {string} user_id
     * @param {string} sender - 'user' or 'admin' (who sent the messages we want to mark as read)
     */
    static async markAsRead(user_id, sender) {
        const { error } = await supabaseAdmin
            .from('messages')
            .update({ is_read: true })
            .eq('user_id', user_id)
            .eq('sender', sender);

        if (error) {
            console.error('Error marking messages as read:', error);
            return { success: false, error };
        }
        return { success: true };
    }
}

export default Message;
