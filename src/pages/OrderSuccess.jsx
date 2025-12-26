import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <div className="bg-green-100 p-4 rounded-full mb-6">
                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-8 max-w-md">
                Thank you for your purchase. Your order has been received and is being processed. You will receive an email confirmation shortly.
            </p>
            <div className="space-x-4">
                <Link
                    to="/dashboard/orders"
                    className="inline-block bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
                >
                    View Order
                </Link>
                <Link
                    to="/products"
                    className="inline-block border border-black text-black px-8 py-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccess;
