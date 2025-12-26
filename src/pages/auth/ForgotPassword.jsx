import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from '../../utils/notification';
import api from '../../utils/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgotpassword', { email });
      setSuccess(true);
      toast.success('Email sent successfully!');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-normal uppercase tracking-widest text-black mb-2">Forgot Password</h1>
          <p className="text-sm text-gray-500">Enter your email to reset your password</p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="bg-green-50 text-green-800 p-4 rounded-md mb-6">
              <p className="text-sm">We have sent a password reset link to your email address.</p>
            </div>
            <Link to="/login" className="text-sm uppercase tracking-wider text-black hover:underline">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">Email Address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full border-b border-gray-300 py-3 px-2 text-sm focus:border-black focus:outline-none transition-colors placeholder-gray-400 bg-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors duration-300 disabled:bg-gray-400"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="text-center">
              <Link to="/login" className="text-xs text-gray-500 hover:text-black transition-colors">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
