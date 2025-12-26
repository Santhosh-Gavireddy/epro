
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import User from './models/User.js';
import fs from 'fs';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const generateLink = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const email = 'santhoshgavireddy93@gmail.com'; // Target user
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User with email ${email} not found`);
            process.exit(1);
        }

        // Generate token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // Construct URL
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

        console.log('\n=============================================');
        console.log('MANUAL RESET LINK GENERATED:');
        console.log(resetUrl);
        console.log('=============================================\n');

        fs.writeFileSync('link.txt', resetUrl);

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

generateLink();
