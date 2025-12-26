import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { toast } from '../utils/notification';

const Wishlist = () => {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleMoveToCart = (item) => {
        addToCart(item);
        removeFromWishlist(item._id);
        toast.success('Moved to cart');
    };

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                <h2 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h2>
                <p className="text-gray-600 mb-8">Looks like you haven't saved any items yet.</p>
                <Link
                    to="/products"
                    className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-3xl font-bold mb-8">My Wishlist ({wishlistItems.length})</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {wishlistItems.map((item) => (
                    <div key={item._id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
                            <img
                                src={item.images && item.images.length > 0
                                    ? (item.images[0].startsWith('http') ? item.images[0] : `http://localhost:5000${item.images[0]}`)
                                    : (item.image || 'https://via.placeholder.com/150')}
                                alt={item.title}
                                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="text-sm text-gray-700">
                                <Link to={`/product/${item._id}`}>
                                    <span aria-hidden="true" className="absolute inset-0" />
                                    {item.title}
                                </Link>
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">₹{item.price}</p>
                        </div>

                        <div className="p-4 border-t border-gray-100 flex justify-between items-center z-10 relative bg-white">
                            <button
                                onClick={() => handleMoveToCart(item)}
                                className="flex items-center text-sm font-medium text-black hover:text-gray-600"
                            >
                                <FaShoppingCart className="mr-2" />
                                Move to Cart
                            </button>
                            <button
                                onClick={() => removeFromWishlist(item._id)}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
