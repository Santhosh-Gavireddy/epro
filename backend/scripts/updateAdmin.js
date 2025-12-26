import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const updateAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const targetEmail = 'santhoshj10419@gmail.com';
        const targetPassword = '143Sanjukings';

        // 1. Check if the target user already exists
        let targetUser = await User.findOne({ email: targetEmail });

        if (targetUser) {
            console.log(`User ${targetEmail} already exists. Updating credentials and role...`);
            targetUser.password = targetPassword;
            targetUser.role = 'admin';
            await targetUser.save();
            console.log('User updated to Admin successfully.');
        } else {
            // 2. If not, check if there is an existing admin we should rename
            // (Only do this if we want to replace the old admin, but here we just want to ensure the specific email works)
            // Let's just create the new admin if they don't exist.
            // But wait, if we have an old admin "admin@example.com", we might want to keep them or delete them?
            // The user asked to "give the admin email... is this", implying this SHOULD be the admin.

            console.log(`User ${targetEmail} not found. Creating new admin...`);
            await User.create({
                name: 'Admin',
                email: targetEmail,
                password: targetPassword,
                role: 'admin'
            });
            console.log('New Admin created successfully.');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateAdmin();
