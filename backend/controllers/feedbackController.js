import Feedback from '../models/Feedback.js';
import User from '../models/User.js';

// @desc    Get all feedbacks
// @route   GET /api/feedback
// @access  Public
export const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Public (or Protected if we enforce login, but user asked for "form")
// We will allow public but if logged in, we can attach user ID.
export const createFeedback = async (req, res) => {
    try {
        const { name, rating, comment, userId } = req.body;

        const feedback = await Feedback.create({
            name,
            rating,
            comment,
            user: userId || null
        });

        res.status(201).json(feedback);
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private/Admin
export const deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        await feedback.deleteOne();

        res.json({ message: 'Feedback removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
