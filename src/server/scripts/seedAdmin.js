import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from server/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

async function seedAdmin() {
    try {
        // Dynamic imports to ensure env vars are loaded first
        const { default: User } = await import('../models/User.js');

        console.log('Seeding Admin user...');

        const adminEmail = 'admin@royalcoffee.com';
        const adminPassword = 'Admin';
        const adminName = 'Admin';

        // Check if admin already exists
        const existingAdmin = await User.findByEmail(adminEmail);

        if (existingAdmin) {
            console.log('Admin user already exists. Updating role and password...');
            await User.update(existingAdmin.id, {
                role: 'admin',
                password: adminPassword,
                name: adminName
            });
        } else {
            console.log('Creating new Admin user...');
            await User.create({
                email: adminEmail,
                password: adminPassword,
                name: adminName,
                role: 'admin'
            });
        }

        console.log('Admin user seeded successfully.');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin user:', error);
        process.exit(1);
    }
}

seedAdmin();
