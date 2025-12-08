import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const createAdmin = async () => {
    const email = 'admin@royalcoffee.com';
    const password = 'Admin123';
    const name = 'Admin User';

    try {
        // Check if user exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (existingUser) {
            console.log('User already exists. Updating role to admin...');
            const { error } = await supabase
                .from('users')
                .update({ role: 'admin' })
                .eq('id', existingUser.id);

            if (error) throw error;
            console.log('✅ User role updated to admin successfully.');
        } else {
            console.log('Creating new admin user...');
            const passwordHash = await bcrypt.hash(password, 10);

            const { error } = await supabase
                .from('users')
                .insert([
                    {
                        email,
                        password_hash: passwordHash,
                        name,
                        role: 'admin',
                    },
                ]);

            if (error) throw error;
            console.log('✅ Admin user created successfully.');
        }
    } catch (error) {
        console.error('❌ Error creating admin:', error);
    }
};

createAdmin();
