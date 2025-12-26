import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaHeart, FaTruck, FaRuler, FaShieldAlt, FaUndo } from 'react-icons/fa';
import { toast } from '../utils/notification';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import SEO from '../components/SEO';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    // const [isWishlist, setIsWishlist] = useState(false); // Managed by context now
    const [activeImage, setActiveImage] = useState('');

    useEffect(() => {
        if (product) {
            setActiveImage((product.images && product.images.length > 0 ? product.images[0] : '') || product.image || '');
        }
    }, [product]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
                // Reset selections when product changes
                setSelectedSize('');
                setSelectedColor('');
                setQuantity(1);
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error('Failed to load product details');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error('Please select a size');
            return;
        }
        // Add to cart logic here (using context)
        // Pass quantity as second argument explicitly
        addToCart({ ...product, size: selectedSize, color: selectedColor }, quantity);
        toast.success('Added to cart successfully!');
    };

    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const isWishlist = product ? isInWishlist(product._id) : false;

    const toggleWishlist = () => {
        if (isWishlist) {
            removeFromWishlist(product._id);
            toast.success('Removed from wishlist');
        } else {
            addToWishlist(product);
            toast.success('Added to wishlist');
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="bg-gray-200 aspect-[3/4] rounded-lg"></div>
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-200 w-3/4 rounded"></div>
                        <div className="h-4 bg-gray-200 w-1/4 rounded"></div>
                        <div className="h-24 bg-gray-200 w-full rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold">Product not found</h2>
                <Link to="/products" className="text-blue-500 hover:underline mt-4 inline-block">
                    Back to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white">
            <SEO
                title={product.title}
                description={product.description}
                image={activeImage}
                keywords={`${product.title}, ${product.category}, ${product.targetAudience}`}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* ... (breadcrumbs) */}
                <nav className="flex text-sm text-gray-500 mb-8">
                    <Link to="/" className="hover:text-black">Home</Link>
                    <span className="mx-2">/</span>
                    <Link to="/products" className="hover:text-black">Shop</Link>
                    <span className="mx-2">/</span>
                    {product.targetAudience && (
                        <>
                            <Link to={`/products?audience=${product.targetAudience}`} className="hover:text-black">{product.targetAudience}</Link>
                            <span className="mx-2">/</span>
                        </>
                    )}
                    <span className="text-black font-medium">{product.title}</span>
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                    {/* Product Image Gallery */}
                    <div className="flex flex-col-reverse md:flex-row gap-4">
                        {/* Thumbnails */}
                        {product.images && product.images.length > 0 && (
                            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-24 md:h-[calc(100vh-200px)] scrollbar-hide">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImage(img)}
                                        className={`relative w-20 h-20 md:w-full md:h-24 flex-shrink-0 border-2 rounded-lg overflow-hidden ${activeImage === img ? 'border-black' : 'border-transparent'
                                            }`}
                                    >
                                        <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="relative flex-1 aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden"
                        >
                            <img
                                src={activeImage || 'https://via.placeholder.com/600x800'}
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={toggleWishlist}
                                className={`absolute top-4 right-4 p-3 rounded-full bg-white shadow-md transition-colors ${isWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                                    }`}
                            >
                                <FaHeart size={20} />
                            </button>
                        </motion.div>
                    </div>

                    {/* Product Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.title}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} size={16} />
                                ))}
                            </div>
                            <span className="text-gray-500 text-sm">(124 reviews)</span>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <div className="text-2xl font-medium text-gray-900">
                                ₹{product.price}
                            </div>
                            <div className={`text-sm font-medium px-3 py-1 rounded-full ${product.stockQty > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {product.stockQty > 0 ? 'In Stock' : 'Out of Stock'}
                            </div>
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-8">
                            {product.description}
                        </p>

                        {/* Size Selector */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-900">Select Size</span>
                                <button className="text-sm text-gray-500 underline flex items-center gap-1">
                                    <FaRuler /> Size Guide
                                </button>
                            </div>
                            <div className="flex gap-3 flex-wrap">
                                {product.sizes && product.sizes.length > 0 ? (
                                    product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${selectedSize === size
                                                ? 'border-black bg-black text-white'
                                                : 'border-gray-200 hover:border-black text-gray-900'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">One Size / No Size Selection</p>
                                )}
                            </div>
                        </div>

                        {/* Color Selector */}
                        <div className="mb-8">
                            <span className="font-medium text-gray-900 block mb-2">Select Color</span>
                            <div className="flex gap-3">
                                {['#000000', '#F5F5DC', '#808080'].map((color, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-8 h-8 rounded-full border border-gray-200 relative ${selectedColor === color ? 'ring-2 ring-offset-2 ring-black' : ''
                                            }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="flex gap-4 mb-8">
                            <div className="flex items-center border border-gray-300 rounded-full px-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="text-gray-500 hover:text-black px-2"
                                >
                                    -
                                </button>
                                <span className="w-8 text-center font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="text-gray-500 hover:text-black px-2"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stockQty <= 0}
                                className={`flex-1 rounded-full font-medium py-3 transition-colors shadow-lg ${product.stockQty > 0
                                    ? 'bg-black text-white hover:bg-gray-800'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {product.stockQty > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>

                        {/* Delivery Info */}
                        <div className="space-y-4 border-t border-gray-100 pt-6">
                            <div className="flex items-center gap-3 text-gray-600 text-sm">
                                <FaTruck className="text-xl" />
                                <span>Free delivery on orders over ₹999</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 text-sm">
                                <FaUndo className="text-xl" />
                                <span>30 days return policy</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 text-sm">
                                <FaShieldAlt className="text-xl" />
                                <span>Secure payment & checkout</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs Section */}
                <div className="mt-20">
                    <div className="flex border-b border-gray-200 mb-8">
                        {['description', 'reviews', 'shipping'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 px-8 text-sm font-medium uppercase tracking-wider transition-colors relative ${activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="py-4">
                        {activeTab === 'description' && (
                            <div className="prose max-w-none text-gray-600">
                                <p>{product.description}</p>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="text-gray-600">Reviews content coming soon...</div>
                        )}
                        {activeTab === 'shipping' && (
                            <div className="text-gray-600">Shipping information content coming soon...</div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-20">
                    <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {/* Placeholder related products */}
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="group cursor-pointer">
                                <div className="bg-gray-100 aspect-[3/4] rounded-lg mb-4 overflow-hidden">
                                    <img
                                        src={`https://source.unsplash.com/random/400x500?fashion&sig=${item}`}
                                        alt="Related Product"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="font-medium text-gray-900">Classic Essential {item}</h3>
                                <p className="text-gray-500">₹1,299</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
