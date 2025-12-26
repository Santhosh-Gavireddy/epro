import express from 'express';
import {
    getHeroSlides,
    createHeroSlide,
    deleteHeroSlide,
    getCollections,
    createCollection,
    deleteCollection,
    getTrending,
    createTrending,
    deleteTrending,
    getCategories,
    createCategory,
    deleteCategory,
} from '../controllers/visualsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Hero Slides
router.route('/hero')
    .get(getHeroSlides)
    .post(protect, admin, createHeroSlide);
router.route('/hero/:id')
    .delete(protect, admin, deleteHeroSlide);

// Collections
router.route('/collections')
    .get(getCollections)
    .post(protect, admin, createCollection);
router.route('/collections/:id')
    .delete(protect, admin, deleteCollection);

// Trending
router.route('/trending')
    .get(getTrending)
    .post(protect, admin, createTrending);
router.route('/trending/:id')
    .delete(protect, admin, deleteTrending);

// Categories
router.route('/categories')
    .get(getCategories)
    .post(protect, admin, createCategory);
router.route('/categories/:id')
    .delete(protect, admin, deleteCategory);

export default router;
