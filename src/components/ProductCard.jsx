import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaPlus, FaEye } from 'react-icons/fa';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const id = product._id || product.id || product.slug;
  const title = product.title || product.name;
  const price = product.price;
  const image =
    product.image ||
    (product.images && product.images[0]) ||
    'https://via.placeholder.com/400x300';

  return (
    <div className="group relative">
      <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
        <Link to={`/product/${encodeURIComponent(id)}`}>
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Hover Actions */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={() => addToCart(product, 1)}
            className="bg-white text-black p-3 rounded-full hover:bg-black hover:text-white transition-colors shadow-md"
            title="Add to Cart"
          >
            <FaPlus className="h-4 w-4" />
          </button>
          <Link
            to={`/product/${encodeURIComponent(id)}`}
            className="bg-white text-black p-3 rounded-full hover:bg-black hover:text-white transition-colors shadow-md"
            title="View Details"
          >
            <FaEye className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mt-4 text-center">
        <h3 className="text-sm text-gray-700 uppercase tracking-wide">
          <Link to={`/product/${encodeURIComponent(id)}`}>
            {title}
          </Link>
        </h3>
        <p className="mt-1 text-sm font-medium text-gray-900">₹{price}</p>
      </div>
    </div>
  );
}
