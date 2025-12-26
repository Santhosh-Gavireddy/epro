import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from '../../utils/notification';
import { FiUpload, FiArrowLeft } from 'react-icons/fi';

export default function AddProduct() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        stockQuantity: '',
        images: [],
        sku: '',
        targetAudience: 'Unisex',
        collection: 'None',
        type: 'Clothing',
        sizes: []
    });
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [availableSizes, setAvailableSizes] = useState([]);

    useEffect(() => {
        updateAvailableSizes();
    }, [formData.type, formData.category]);

    useEffect(() => {
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/products/${id}`);
            setFormData({
                title: data.title,
                description: data.description,
                price: data.price,
                category: data.category,
                stockQuantity: data.stockQty, // Map back to stockQuantity for form
                images: data.images || (data.image ? [data.image] : []),
                sku: data.sku || '',
                targetAudience: data.targetAudience || 'Unisex',
                collection: data.collection || 'None',
                type: data.type || 'Clothing',
                sizes: data.sizes || []
            });
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Failed to load product details');
            navigate('/dashboard/products');
        } finally {
            setLoading(false);
        }
    };

    const updateAvailableSizes = () => {
        let sizes = [];
        if (formData.type === 'Clothing') {
            if (formData.category.toLowerCase().includes('pant') || formData.category.toLowerCase().includes('jeans') || formData.category.toLowerCase().includes('trouser')) {
                sizes = ['28', '30', '32', '34', '36', '38', '40'];
            } else {
                sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
            }
        } else if (formData.type === 'Footwear') {
            sizes = ['6', '7', '8', '9', '10', '11', '12'];
        } else {
            sizes = []; // Accessories usually don't have sizes or have 'One Size'
        }
        setAvailableSizes(sizes);
        // Clear selected sizes if type changes
        setFormData(prev => ({ ...prev, sizes: [] }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSizeToggle = (size) => {
        setFormData(prev => {
            const currentSizes = prev.sizes || [];
            if (currentSizes.includes(size)) {
                return { ...prev, sizes: currentSizes.filter(s => s !== size) };
            } else {
                return { ...prev, sizes: [...currentSizes, size] };
            }
        });
    };

    const [imageUrlInput, setImageUrlInput] = useState('');

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        const uploadedUrls = [];

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            for (const file of files) {
                const formData = new FormData();
                formData.append('image', file);
                const { data } = await api.post('/upload', formData, config);
                uploadedUrls.push(data);
            }

            setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
            toast.success('Images uploaded successfully');
        } catch (error) {
            console.error(error);
            toast.error('Image upload failed');
        } finally {
            setUploading(false);
            // Reset file input
            e.target.value = '';
        }
    };

    const handleAddImageUrl = () => {
        if (!imageUrlInput.trim()) return;
        setFormData(prev => ({ ...prev, images: [...prev.images, imageUrlInput] }));
        setImageUrlInput('');
        toast.success('Image URL added');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productData = {
                ...formData,
                price: Number(formData.price),
                stockQty: Number(formData.stockQuantity), // Send as stockQty
                image: formData.images[0] || '', // Set primary image for backward compatibility
            };

            if (isEditMode) {
                await api.put(`/products/${id}`, productData);
                toast.success('Product updated successfully');
            } else {
                await api.post('/products', productData);
                toast.success('Product created successfully');
            }
            navigate('/dashboard/products');
        } catch (error) {
            console.error(error);
            toast.error('Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <button
                    onClick={() => navigate('/dashboard/products')}
                    className="flex items-center text-gray-600 hover:text-black transition-colors mb-4"
                >
                    <FiArrowLeft className="mr-2" />
                    Back to Products
                </button>
                <h1 className="text-3xl font-bold text-gray-900">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
                <p className="mt-2 text-gray-600">{isEditMode ? 'Update product details.' : 'Fill in the details to create a new product.'}</p>
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                                <input
                                    type="number"
                                    name="stockQuantity"
                                    value={formData.stockQuantity}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. T-Shirts, Jeans"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">SKU</label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Target Audience</label>
                                <select
                                    name="targetAudience"
                                    value={formData.targetAudience}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                >
                                    <option value="Men">Men</option>
                                    <option value="Women">Women</option>
                                    <option value="Kids">Kids</option>
                                    <option value="Unisex">Unisex</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Product Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                >
                                    <option value="Clothing">Clothing</option>
                                    <option value="Footwear">Footwear</option>
                                    <option value="Accessory">Accessory</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Collection</label>
                                <select
                                    name="collection"
                                    value={formData.collection}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                >
                                    <option value="None">None</option>
                                    <option value="New Arrival">New Arrival</option>
                                    <option value="Best Seller">Best Seller</option>
                                    <option value="Featured">Featured</option>
                                </select>
                            </div>

                            {/* Size Selection */}
                            {availableSizes.length > 0 && (
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
                                    <div className="flex flex-wrap gap-2">
                                        {availableSizes.map((size) => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => handleSizeToggle(size)}
                                                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${formData.sizes.includes(size)
                                                    ? 'bg-black text-white border-black'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">Click to select available sizes for this product.</p>
                                </div>
                            )}

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                ></textarea>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Images</label>
                                <div className="mt-1 flex flex-col gap-4">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={imageUrlInput}
                                            onChange={(e) => setImageUrlInput(e.target.value)}
                                            placeholder="Paste image URL here"
                                            className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddImageUrl}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none"
                                        >
                                            Add URL
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-200 transition-colors flex items-center gap-2">
                                            <FiUpload className="w-5 h-5 text-gray-600" />
                                            <span className="text-sm text-gray-700">Upload Images</span>
                                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" multiple />
                                        </label>
                                        <span className="text-xs text-gray-500">Supported: JPG, PNG, WebP</span>
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-4">
                                    {formData.images && formData.images.map((img, index) => (
                                        <div key={index} className="relative aspect-square bg-gray-50 border border-gray-200 rounded-md overflow-hidden group">
                                            <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-contain" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-5 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard/products')}
                                className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || uploading}
                                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-black text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:text-sm disabled:bg-gray-400"
                            >
                                {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Product' : 'Create Product')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
