import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const total = getCartTotal();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-light uppercase tracking-widest mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any items to the cart yet.</p>
        <Link
          to="/products"
          className="bg-black text-white px-8 py-3 uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors duration-300"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-normal uppercase tracking-widest text-black mb-12 text-center">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="hidden md:grid grid-cols-12 gap-4 border-b border-gray-200 pb-4 text-sm uppercase tracking-wider text-gray-500 font-medium">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          <div className="space-y-6 md:space-y-0">
            {cartItems.map((item) => (
              <div key={item._id} className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center py-6 border-b border-gray-100">
                {/* Product Info */}
                <div className="col-span-6 flex items-center gap-4 w-full">
                  <div className="w-20 h-24 bg-gray-100 flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium uppercase tracking-wide text-black">
                      <Link to={`/product/${item._id}`}>{item.title}</Link>
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Size: M (Placeholder)</p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-xs text-red-500 hover:text-red-700 mt-2 flex items-center gap-1 uppercase tracking-wider"
                    >
                      <FiTrash2 /> Remove
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-2 text-center w-full flex justify-between md:justify-center md:block">
                  <span className="md:hidden text-gray-500 text-sm">Price:</span>
                  <span className="text-sm font-medium">₹{item.price.toFixed(2)}</span>
                </div>

                {/* Quantity */}
                <div className="col-span-2 flex justify-center w-full md:w-auto">
                  <div className="flex items-center border border-gray-300">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <FiMinus className="w-3 h-3" />
                    </button>
                    <span className="w-10 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <FiPlus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="col-span-2 text-right w-full flex justify-between md:justify-end md:block">
                  <span className="md:hidden text-gray-500 text-sm">Total:</span>
                  <span className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <Link to="/products" className="text-sm uppercase tracking-wider text-gray-500 hover:text-black transition-colors border-b border-transparent hover:border-black pb-1">
              Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-sm uppercase tracking-wider text-red-500 hover:text-red-700 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-gray-50 p-8">
            <h3 className="text-lg font-normal uppercase tracking-widest mb-6">Cart Totals</h3>

            <div className="space-y-4 mb-6 border-b border-gray-200 pb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-500 text-xs italic">Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-base font-medium uppercase tracking-wide">Total</span>
              <span className="text-xl font-medium">₹{total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-black text-white py-4 uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors duration-300"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}