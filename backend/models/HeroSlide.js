import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const HeroSlide = mongoose.model('HeroSlide', heroSlideSchema);

export default HeroSlide;
