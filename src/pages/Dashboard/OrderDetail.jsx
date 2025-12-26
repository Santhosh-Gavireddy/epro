import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { FiArrowLeft, FiPackage, FiTruck, FiMapPin, FiCreditCard, FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import { toast } from '../../utils/notification';
import { useAuth } from '../../context/AuthContext';

export default function OrderDetail() {
    const { id } = useParams();
    const { isAdmin } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data);
            } catch (err) {
                console.error('Error fetching order details:', err);
                const msg = err.response?.data?.message || 'Failed to load order details';
                setError(msg);
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-indigo-100 text-indigo-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const handleCancelOrder = async () => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;

        try {
            await api.put(`/orders/${id}/cancel`);
            toast.success('Order cancelled successfully');
            // Refresh order
            const { data } = await api.get(`/orders/${id}`);
            setOrder(data);
        } catch (err) {
            console.error('Error cancelling order:', err);
            toast.error(err.response?.data?.message || 'Failed to cancel order');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-red-600">Error loading order</h3>
                <p className="mt-1 text-gray-500">{error || 'Order not found'}</p>
                <Link to="/dashboard/orders" className="mt-4 inline-flex items-center text-black hover:underline">
                    <FiArrowLeft className="mr-2" /> Back to Orders
                </Link>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <Link to="/dashboard/orders" className="mr-4 text-gray-500 hover:text-black transition-colors">
                        <FiArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Order #{order._id.substring(18).toUpperCase()}</h1>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                            <FiCalendar className="mr-2" /> Placed on {format(new Date(order.createdAt), 'MMMM d, yyyy')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* Mark as Paid Button (Admin Only) */}
                    {isAdmin && !order.isPaid && (
                        <button
                            onClick={async () => {
                                if (window.confirm('Mark this order as PAID? This will also update status to Processing.')) {
                                    try {
                                        // Update to Paid AND Processing if currently pending
                                        await api.put(`/orders/${order._id}/status`, {
                                            isPaid: true,
                                            status: order.status === 'pending' ? 'processing' : order.status
                                        });
                                        toast.success("Order marked as Paid & Processing");
                                        // Refresh
                                        const { data } = await api.get(`/orders/${id}`);
                                        setOrder(data);
                                    } catch (e) {
                                        toast.error("Failed to update status");
                                    }
                                }
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-sm"
                        >
                            Mark as Paid
                        </button>
                    )}

                    {order.status === 'pending' && (
                        <button
                            onClick={handleCancelOrder}
                            className="px-4 py-2 border border-red-300 text-red-700 rounded-md text-sm font-medium hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                            Cancel Order
                        </button>
                    )}
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                <FiPackage className="mr-2" /> Order Items ({order.items.length})
                            </h2>
                        </div>
                        <ul className="divide-y divide-gray-100">
                            {order.items.map((item, index) => (
                                <li key={index} className="p-6 flex items-center">
                                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                        <Link to={`/product/${item.product?._id || item.product}`}>
                                            <img
                                                src={item.image || item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                                                alt={item.name || item.product?.title}
                                                className="h-full w-full object-cover object-center hover:opacity-75 transition-opacity"
                                            />
                                        </Link>
                                    </div>
                                    <div className="ml-6 flex-1 flex flex-col">
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                            <Link to={`/product/${item.product?._id || item.product}`} className="hover:text-green-600 transition-colors">
                                                <h3>{item.name || item.product?.title}</h3>
                                            </Link>
                                            <p className="ml-4">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">Qty {item.quantity}</p>
                                        <p className="mt-1 text-sm text-gray-500">Price: ₹{item.price.toLocaleString('en-IN')}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                            <div className="flex justify-between text-base font-medium text-gray-900">
                                <p>Total Amount</p>
                                <p>₹{order.totalPrice.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Order Info */}
                <div className="space-y-6">
                    {/* Shipping Info */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FiTruck className="mr-2" /> Shipping Information
                        </h2>
                        <div className="text-sm text-gray-600 space-y-2">
                            <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.email}</p>
                            <p>{order.shippingAddress.phone}</p>
                            <div className="flex items-start mt-2">
                                <FiMapPin className="mr-2 mt-0.5 flex-shrink-0" />
                                <p>
                                    {order.shippingAddress.address}<br />
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                                    {order.shippingAddress.country}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FiCreditCard className="mr-2" /> Payment Details
                        </h2>
                        <div className="text-sm text-gray-600 space-y-3">
                            <div className="flex justify-between">
                                <span>Payment Method</span>
                                <span className="font-medium capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Payment Status</span>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {order.isPaid ? 'Paid' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                            {order.isPaid && order.paidAt && (
                                <div className="flex justify-between">
                                    <span>Paid At</span>
                                    <span>{format(new Date(order.paidAt), 'MMM d, yyyy')}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User Info (Admin Only) */}
                    {order.user && (
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <FiUser className="mr-2" /> Customer
                            </h2>
                            <div className="text-sm text-gray-600">
                                <p className="font-medium text-gray-900">{order.user.name}</p>
                                <p>{order.user.email}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
