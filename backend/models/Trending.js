import mongoose from 'mongoose';

const trendingSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    // We can add colSpan/rowSpan later if customizable, but for now we follow the user's request: "Trending Styles... add them from there"
    // The layout in Home.jsx assumes 4 items. We might just let them add N items and take first 4.
}, { timestamps: true });

const Trending = mongoose.model('Trending', trendingSchema);

export default Trending;
