import HeroSlide from '../models/HeroSlide.js';
import Collection from '../models/Collection.js';
import Trending from '../models/Trending.js';
import Category from '../models/Category.js';

// Hero Slides
export const getHeroSlides = async (req, res) => {
    try {
        const slides = await HeroSlide.find().sort({ createdAt: 1 });
        res.json(slides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createHeroSlide = async (req, res) => {
    try {
        const { image, title, subtitle } = req.body;
        const slide = new HeroSlide({ image, title, subtitle });
        const savedSlide = await slide.save();
        res.status(201).json(savedSlide);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteHeroSlide = async (req, res) => {
    try {
        const { id } = req.params;
        await HeroSlide.findByIdAndDelete(id);
        res.json({ message: 'Slide removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Collections
export const getCollections = async (req, res) => {
    try {
        const collections = await Collection.find().sort({ createdAt: 1 });
        res.json(collections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createCollection = async (req, res) => {
    try {
        const { name, image, link } = req.body;
        const collection = new Collection({ name, image, link });
        const savedCollection = await collection.save();
        res.status(201).json(savedCollection);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteCollection = async (req, res) => {
    try {
        const { id } = req.params;
        await Collection.findByIdAndDelete(id);
        res.json({ message: 'Collection removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Trending Styles
export const getTrending = async (req, res) => {
    try {
        const trending = await Trending.find().sort({ createdAt: 1 });
        res.json(trending);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTrending = async (req, res) => {
    try {
        const { image, title } = req.body;
        const trending = new Trending({ image, title });
        const savedTrending = await trending.save();
        res.status(201).json(savedTrending);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTrending = async (req, res) => {
    try {
        const { id } = req.params;
        await Trending.findByIdAndDelete(id);
        res.json({ message: 'Trending style removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name, image } = req.body;
        const category = new Category({ name, image });
        const savedCategory = await category.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        res.json({ message: 'Category removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
