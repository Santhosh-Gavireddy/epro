import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { toast } from '../../../utils/notification';
import { FiTrash2, FiUpload } from 'react-icons/fi';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        image: '',
    });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/visuals/categories');
            setCategories(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this category?')) {
            try {
                await api.delete(`/visuals/categories/${id}`);
                toast.success('Category deleted');
                fetchCategories();
            } catch (error) {
                toast.error('Failed to delete category');
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
            await api.post('/visuals/categories', formData);
            toast.success('Category added');
            setFormData({ name: '', image: '' });
            fetchCategories();
        } catch (error) {
            toast.error('Failed to add category');
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Manage Shop By Category</h1>

            <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Add Category</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <input
                            type="text"
                            placeholder="Name (e.g. Men, Women, Kids)"
                            className="border p-2 rounded w-full"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        Add Category
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loading ? <p>Loading...</p> : categories.map((item) => (
                    <div key={item._id} className="bg-white rounded-lg shadow overflow-hidden relative group">
                        <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="font-bold text-lg">{item.name}</h3>
                        </div>
                        <button
                            onClick={() => handleDelete(item._id)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <FiTrash2 />
                        </button>
                    </div>
                ))}
                {!loading && categories.length === 0 && <p className="text-gray-500">No categories added yet.</p>}
            </div>
        </div>
    );
}
