import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { toast } from '../../../utils/notification';
import { FiTrash2, FiUpload } from 'react-icons/fi';

export default function Trending() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        image: '',
    });

    const fetchItems = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/visuals/trending');
            setItems(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load trending styles');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this style?')) {
            try {
                await api.delete(`/visuals/trending/${id}`);
                toast.success('Style deleted');
                fetchItems();
            } catch (error) {
                toast.error('Failed to delete style');
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
            await api.post('/visuals/trending', formData);
            toast.success('Style added');
            setFormData({ title: '', image: '' });
            fetchItems();
        } catch (error) {
            toast.error('Failed to add style');
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Manage Trending Styles (Bento Grid)</h1>
            <p className="text-gray-500 mb-6">Note: The first 4 items will be displayed in the Bento Grid layout on the homepage.</p>

            <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Add Beato Grid Item</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <input
                            type="text"
                            placeholder="Title (e.g. T-Shirts)"
                            className="border p-2 rounded w-full"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                        Add Style
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? <p>Loading...</p> : items.map((item, index) => (
                    <div key={item._id} className="bg-white rounded-lg shadow overflow-hidden relative group">
                        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            Position: {index + 1}
                        </div>
                        <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="font-bold text-lg">{item.title}</h3>
                        </div>
                        <button
                            onClick={() => handleDelete(item._id)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <FiTrash2 />
                        </button>
                    </div>
                ))}
                {!loading && items.length === 0 && <p className="text-gray-500">No trending styles added yet.</p>}
            </div>
        </div>
    );
}
