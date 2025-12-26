// src/pages/Checkout.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { FiCheck, FiChevronRight, FiShoppingBag, FiTruck, FiCreditCard, FiGift, FiLoader } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import { toast } from '../utils/notification';
import { motion } from 'framer-motion';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    saveInfo: false,
    paymentMethod: 'cod'
  });
  const [orderComplete, setOrderComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { cartItems, clearCart, getCartTotal } = useCart();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Only show toast if we're not already on the login page
      if (!window.location.pathname.includes('login')) {
        toast.info('Please login to complete your order');
        navigate('/login', {
          state: { from: '/checkout' },
          replace: true
        });
      }
    }
  }, [navigate]);

  // Don't render checkout if not authenticated
  if (!localStorage.getItem('token')) {
    return null; // or a loading spinner
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step < 4) {
      setStep(step + 1);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Your session has expired. Please login again.');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    try {
      setLoading(true);

      const subtotal = getCartTotal();
      const shipping = subtotal > 999 ? 0 : 49;
      const total = subtotal + shipping;

      const orderData = {
        items: cartItems.map(item => ({
          product: item._id || item.id,
          name: item.title || item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.zip,
          country: formData.country,
          email: formData.email,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod,
        totalPrice: total,
        isPaid: formData.paymentMethod === 'cod' ? false : true,
        status: 'pending'
      };

      // Save order to backend with proper auth headers
      const { data } = await api.post('/orders', orderData);

      // Clear cart and show success
      clearCart();
      setOrderComplete(true);

      // Redirect to dashboard after delay
      setTimeout(() => {
        navigate('/dashboard/orders');
      }, 3000);

    } catch (error) {
      console.error('Error placing order:', error);
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        toast.error('Your session has expired. Please login again.');
        navigate('/login', { state: { from: '/checkout' } });
      } else {
        toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, name: 'Shipping', icon: <FiTruck /> },
    { id: 2, name: 'Payment', icon: <FiCreditCard /> },
    { id: 3, name: 'Review', icon: <FiShoppingBag /> },
    { id: 4, name: 'Complete', icon: <FiGift /> }
  ];

  // Animation variants for the progress bar
  const progressBarVariants = {
    hidden: { width: '0%' },
    visible: {
      width: `${((step - 1) / (steps.length - 1)) * 100}%`,
      transition: { duration: 0.5, ease: 'easeInOut' }
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="w-10 h-10 text-black" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for your order. We've sent you an email with your order confirmation.
          </p>
          <div className="max-w-md mx-auto bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
            <p className="text-gray-600">Order #12345</p>
            <p className="text-gray-600">Estimated delivery: 3-5 business days</p>
          </div>
          <div className="mt-8">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Stepper */}
        <div className="relative mb-12">
          <div className="flex items-center justify-between">
            {steps.map((stepItem, index) => (
              <div key={stepItem.id} className="flex flex-col items-center relative z-10">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${step >= stepItem.id
                    ? 'bg-black text-white scale-110'
                    : 'bg-gray-200 text-gray-600'
                    } transition-all duration-300`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {step > stepItem.id ? (
                    <FiCheck className="w-6 h-6" />
                  ) : step === stepItem.id ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      {stepItem.icon}
                    </motion.div>
                  ) : (
                    stepItem.icon
                  )}
                </motion.div>
                <span
                  className={`mt-2 text-sm font-medium transition-colors duration-300 ${step >= stepItem.id ? 'text-black font-semibold' : 'text-gray-500'
                    }`}
                >
                  {stepItem.name}
                </span>
                {step === stepItem.id && (
                  <motion.div
                    className="absolute -bottom-8 w-24 h-1 bg-black rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Animated progress bar */}
          <div className="absolute top-6 left-0 right-0 h-2 bg-gray-200 rounded-full -z-10 overflow-hidden">
            <motion.div
              className="h-full bg-black rounded-full"
              initial="hidden"
              animate="visible"
              variants={progressBarVariants}
            />
          </div>

          {/* Animated dots */}
          <div className="absolute top-5 left-0 right-0 flex justify-between px-6 -z-0">
            {[...Array(steps.length - 1)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-4 h-4 rounded-full ${step > i + 1 ? 'bg-black' : 'bg-gray-300'
                  }`}
                initial={{ scale: 0 }}
                animate={{
                  scale: step > i + 1 ? 1 : 0.5,
                  backgroundColor: step > i + 1 ? '#000000' : '#E5E7EB'
                }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        </div>

        <div className="mt-12 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Shipping Information</h3>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone number
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          required
                          maxLength="10"
                          pattern="[0-9]{10}"
                          value={formData.phone}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                          placeholder="9876543210"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                      >
                        <option>India</option>
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>Australia</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Street address
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State / Province
                      </label>
                      <input
                        type="text"
                        name="state"
                        id="state"
                        required
                        value={formData.state}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                        ZIP / Postal code
                      </label>
                      <input
                        type="text"
                        name="zip"
                        id="zip"
                        required
                        maxLength="6"
                        pattern="[0-9]{6}"
                        value={formData.zip}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="save-info"
                      name="saveInfo"
                      type="checkbox"
                      checked={formData.saveInfo}
                      onChange={handleChange}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <label htmlFor="save-info" className="ml-2 block text-sm text-gray-700">
                      Save this information for next time
                    </label>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="cash-on-delivery"
                        name="paymentMethod"
                        type="radio"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleChange}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300"
                      />
                      <label htmlFor="cash-on-delivery" className="ml-3 block text-sm font-medium text-gray-700">
                        Cash on Delivery
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="credit-card"
                        name="paymentMethod"
                        type="radio"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleChange}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300"
                        disabled
                      />
                      <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-400">
                        Credit/Debit Card (Coming Soon)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="upi"
                        name="paymentMethod"
                        type="radio"
                        value="upi"
                        checked={formData.paymentMethod === 'upi'}
                        onChange={handleChange}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300"
                        disabled
                      />
                      <label htmlFor="upi" className="ml-3 block text-sm font-medium text-gray-400">
                        UPI (Coming Soon)
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Review Your Order</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">Shipping Address</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {formData.firstName} {formData.lastName}<br />
                      {formData.address}<br />
                      {formData.city}, {formData.state} {formData.zip}<br />
                      {formData.country}<br />
                      {formData.email}<br />
                      {formData.phone}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">Payment Method</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">Order Summary</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>₹{getCartTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>{getCartTotal() > 999 ? 'Free' : '₹49.00'}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium text-gray-900 mt-2 pt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span>₹{(getCartTotal() + (getCartTotal() > 999 ? 0 : 49)).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-gray-200">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  {step === 3 ? 'Place Order' : 'Continue'}
                  <FiChevronRight className="ml-2 -mr-1 h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;