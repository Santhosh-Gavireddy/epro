
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import User from './models/User.js';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const definitiveReset = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected`);

        const updates = [
            { email: 'santhoshj10419@gmail.com', password: 'admin123', role: 'admin' },
            { email: 'admin@example.com', password: 'admin123', role: 'admin' },
            { email: 'santhoshgavireddy93@gmail.com', password: 'password123', role: 'user' }
        ];

        console.log('\n--- CREDENTIALS UPDATED ---');

        for (const update of updates) {
            // Find or create
            let user = await User.findOne({ email: update.email });

            if (!user) {
                user = new User({
                    email: update.email,
                    name: update.email.split('@')[0],
                    role: update.role
                });
                console.log(`Created new user: ${update.email}`);
            }

            user.password = update.password;
            user.role = update.role; // Ensure role is correct
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            console.log(`User: ${update.email}`);
            console.log(`Pass: ${update.password}`);
            console.log(`Role: ${update.role}`);
            console.log('---------------------------');
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

definitiveReset();
