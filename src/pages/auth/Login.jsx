import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../utils/notification';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';
  const isAdminLogin = location.pathname.includes('/admin/login');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login({ email, password });

      if (res.success) {
        toast.success('Welcome back!');

        // Check if user is admin
        if (res.data.role === 'admin') {
          navigate('/dashboard', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        toast.error(res.error || 'Failed to login');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-normal uppercase tracking-widest text-black mb-2">
            {isAdminLogin ? 'Admin Sign In' : 'Sign In'}
          </h1>
          <p className="text-sm text-gray-500">Please enter your details to continue</p>
        </div>

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

          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border-b border-gray-300 py-3 px-2 text-sm focus:border-black focus:outline-none transition-colors placeholder-gray-400 bg-transparent"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="mr-2 accent-black" />
              Remember me
            </label>
            <Link to="/forgot-password" className="hover:text-black transition-colors">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors duration-300 disabled:bg-gray-400"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {!isAdminLogin && (
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="text-black font-medium hover:underline uppercase tracking-wider">
                Create Account
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
