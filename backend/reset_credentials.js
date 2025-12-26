
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import User from './models/User.js';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const resetCredentials = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // List all users
        const users = await User.find({});
        console.log('\n--- Existing Users ---');
        users.forEach(user => {
            console.log(`Email: ${user.email} | Role: ${user.role} | Name: ${user.name}`);
        });
        console.log('----------------------\n');

        // Find Admin
        let admin = await User.findOne({ role: 'admin' });

        if (admin) {
            console.log(`Found Admin: ${admin.email}`);
            admin.password = 'admin123';
            await admin.save();
            console.log('Admin password reset to: admin123');
        } else {
            console.log('No admin found. Creating one...');
            admin = await User.create({
                name: 'Admin',
                email: 'admin@epro.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log(`Admin created: ${admin.email} / admin123`);
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

resetCredentials();
