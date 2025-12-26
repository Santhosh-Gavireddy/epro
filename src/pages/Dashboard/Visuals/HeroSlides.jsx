import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { toast } from '../../../utils/notification';
import { FiPlus, FiTrash2, FiUpload } from 'react-icons/fi';

export default function HeroSlides() {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        image: '',
    });

    const fetchSlides = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/visuals/hero');
            setSlides(data);
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || 'Failed to load slides';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this slide?')) {
            try {
                await api.delete(`/visuals/hero/${id}`);
                toast.success('Slide deleted');
                fetchSlides();
            } catch (error) {
                toast.error('Failed to delete slide');
            }
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const form = new FormData();
        form.append('image', file);

        try {
            const { data } = await api.post('/upload', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setFormData({ ...formData, image: data });
            toast.success('Image uploaded');
        } catch (error) {
            toast.error('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.image) return toast.error('Image is required');

        try {
            await api.post('/visuals/hero', formData);
            toast.success('Slide added');
            setFormData({ title: '', subtitle: '', image: '' });
            fetchSlides();
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || 'Failed to add slide';
            toast.error(message);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Manage Hero Swiper</h1>

            {/* Add New Slide Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Add New Slide</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Title"
                            className="border p-2 rounded w-full"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Subtitle"
                            className="border p-2 rounded w-full"
                            value={formData.subtitle}
                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        {formData.image && (
                            <img src={formData.image} alt="Preview" className="h-20 w-32 object-cover rounded" />
                        )}
                        <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded border hover:bg-gray-200 flex items-center gap-2">
                            <FiUpload /> {uploading ? 'Uploading...' : 'Upload Image'}
                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" disabled={uploading} />
                        </label>
                        <input
                            type="text"
                            placeholder="Or paste Image URL"
                            className="border p-2 rounded flex-1"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
                        Add Slide
                    </button>
                </form>
            </div>

            {/* List Existing Slides */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? <p>Loading...</p> : slides.map((slide) => (
                    <div key={slide._id} className="bg-white rounded-lg shadow overflow-hidden relative group">
                        <img src={slide.image} alt={slide.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="font-bold text-lg">{slide.title}</h3>
                            <p className="text-gray-600">{slide.subtitle}</p>
                        </div>
                        <button
                            onClick={() => handleDelete(slide._id)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <FiTrash2 />
                        </button>
                    </div>
                ))}
                {!loading && slides.length === 0 && <p className="text-gray-500">No slides added yet.</p>}
            </div>
        </div>
    );
}
