
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import User from './models/User.js';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const forceReset = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Try finding the user we identified earlier
        const emails = ['santhoshgavireddy93@gmail.com', 'santhoshj10419@gmail.com'];

        for (const email of emails) {
            const user = await User.findOne({ email });
            if (user) {
                user.password = 'password123';
                user.resetPasswordToken = undefined;
                user.resetPasswordExpire = undefined;
                await user.save();
                console.log(`SUCCESS: Password for ${email} reset to: password123`);
            } else {
                console.log(`User ${email} not found.`);
            }
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

forceReset();
