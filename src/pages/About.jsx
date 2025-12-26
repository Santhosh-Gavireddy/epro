import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { FaStar } from 'react-icons/fa';
import api from '../utils/api';
import { toast } from '../utils/notification';
import { useAuth } from '../context/AuthContext';
import 'swiper/css';
import 'swiper/css/pagination';

const About = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-gray-900 py-24 px-6 sm:px-12 lg:px-24">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                        alt="About Us Hero"
                        className="w-full h-full object-cover opacity-30"
                    />
                </div>
                <div className="relative max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Our Story
                    </h1>
                    <p className="mt-6 text-xl text-gray-300">
                        Crafting fashion that speaks to your soul.
                    </p>
                </div>
            </div>

            {/* Brand Story */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
                        <p className="text-lg text-gray-600 mb-6">
                            ePro was born from a simple idea: fashion should be accessible, sustainable, and expressive.
                            We started in a small studio with a passion for high-quality fabrics and unique designs.
                            Today, we are a global community of trendsetters and style enthusiasts.
                        </p>
                        <p className="text-lg text-gray-600">
                            Our mission is to empower you to express your individuality through our carefully curated collections.
                            We believe that what you wear is an extension of who you are.
                        </p>
                    </div>
                    <div className="mt-10 lg:mt-0">
                        <img
                            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                            alt="Our Team"
                            className="rounded-lg shadow-xl"
                        />
                    </div>
                </div>
            </div>

            {/* Unique Selling Points */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* ... existing USP content ... */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">What Makes Us Unique</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                                💎
                            </div>
                            <h3 className="text-xl font-bold mb-4">Premium Quality</h3>
                            <p className="text-gray-600">
                                We source only the finest materials to ensure comfort and durability in every stitch.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                                🌿
                            </div>
                            <h3 className="text-xl font-bold mb-4">Sustainable</h3>
                            <p className="text-gray-600">
                                Committed to eco-friendly practices and ethical manufacturing processes.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                                ✂️
                            </div>
                            <h3 className="text-xl font-bold mb-4">Handcrafted</h3>
                            <p className="text-gray-600">
                                Many of our pieces are finished by hand, adding that personal touch you deserve.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback Section */}
            <FeedbackSection />
        </div>
    );
};

// Sub-component for Feedback to keep main component clean
const FeedbackSection = () => {
    const [name, setName] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth(); // Pre-fill name if logged in

    useEffect(() => {
        if (user) setName(user.name);
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/feedback', { name, rating, comment, userId: user?._id });
            toast.success('Thank you for your feedback!');
            setComment('');
            setRating(5);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to submit feedback');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Submission Form */}
                <div className="max-w-2xl mx-auto bg-gray-50 rounded-2xl p-8 shadow-sm">
                    <h3 className="text-2xl font-bold text-center mb-6">Share Your Experience</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Rating</label>
                            <div className="flex gap-2 mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`text-2xl transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                        <FaStar />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                                placeholder="Your Name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Comment</label>
                            <textarea
                                required
                                rows={4}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                                placeholder="How was your experience?"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default About;
