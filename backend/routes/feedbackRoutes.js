import express from 'express';
import {
    getAllFeedbacks,
    createFeedback,
    deleteFeedback
} from '../controllers/feedbackController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(getAllFeedbacks)
    .post(createFeedback); // Public submission

router.route('/:id')
    .delete(protect, admin, deleteFeedback);

export default router;
