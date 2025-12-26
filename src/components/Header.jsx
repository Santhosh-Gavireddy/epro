import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaShoppingBag, FaUser, FaBars, FaTimes, FaMicrophone, FaHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from '../utils/notification';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { isAuthenticated, logout, user, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice search is not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true; // Enable live feedback
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast.info('Listening...');
      setSearchQuery(''); // Clear previous query when starting
    };

    recognition.onresult = (event) => {
      let transcript = '';
      let isFinal = false;

      // Loop through results to handle interim and final
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          isFinal = true;
        }
      }

      setSearchQuery(transcript); // Show live text

      if (isFinal) {
        // Sanitize final result: remove trailing punctuation
        const cleanQuery = transcript.replace(/[.,;!?]+$/, "").trim();
        setSearchQuery(cleanQuery);

        setIsListening(false);
        setIsSearchOpen(false);
        navigate(`/products?search=${encodeURIComponent(cleanQuery)}`);
      }
    };

    recognition.onerror = (event) => {
      console.error('Voice search error:', event.error);
      setIsListening(false);
      // Only show toast for real errors, not 'no-speech' or 'aborted' which are common
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        toast.error(`Voice search error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <header className="fixed w-full bg-white z-50 shadow-sm top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tighter">
              EPRO.
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium uppercase tracking-wider hover:text-gray-600 transition-colors ${isActive ? 'text-black' : 'text-gray-500'}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              end
              className={({ isActive }) => {
                const isNewArrivals = location.search.includes('sort=newest');
                // Shop is active if path matches AND it's not New Arrivals
                return `text-sm font-medium uppercase tracking-wider hover:text-gray-600 transition-colors ${isActive && !isNewArrivals ? 'text-black' : 'text-gray-500'}`;
              }}
            >
              Shop
            </NavLink>
            <NavLink
              to="/products?sort=newest"
              className={({ isActive }) => {
                const isNewArrivals = location.search.includes('sort=newest');
                // New Arrivals is active if path matches AND search param exists
                return `text-sm font-medium uppercase tracking-wider hover:text-gray-600 transition-colors ${isActive && isNewArrivals ? 'text-black' : 'text-gray-500'}`;
              }}
            >
              New Arrivals
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm font-medium uppercase tracking-wider hover:text-gray-600 transition-colors ${isActive ? 'text-black' : 'text-gray-500'}`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-sm font-medium uppercase tracking-wider hover:text-gray-600 transition-colors ${isActive ? 'text-black' : 'text-gray-500'}`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-gray-400 hover:text-black transition-colors"
            >
              <FaSearch className="h-5 w-5" />
            </button>

            <Link to="/wishlist" className="text-gray-400 hover:text-black transition-colors relative">
              <FaHeart className="h-5 w-5" />
              {wishlistItems && wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="text-gray-400 hover:text-black transition-colors relative">
              <FaShoppingBag className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.reduce((total, item) => total + (item.quantity || 1), 0)}
                </span>
              )}
            </Link>

            {isAuthenticated() ? (
              <div className="relative group">
                <button className="text-gray-400 hover:text-black transition-colors flex items-center">
                  <FaUser className="h-5 w-5" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  {isAdmin() && (
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-gray-400 hover:text-black transition-colors">
                <FaUser className="h-5 w-5" />
              </Link>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-400 hover:text-black focus:outline-none"
              >
                {isMenuOpen ? (
                  <FaTimes className="h-6 w-6" />
                ) : (
                  <FaBars className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Shop
            </NavLink>
            <NavLink
              to="/products?sort=newest"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              New Arrivals
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Contact
            </NavLink>
            <NavLink
              to="/wishlist"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Wishlist
            </NavLink>
          </div>
        </div>
      )}

      {/* Search Input Overlay */}
      <div className={`absolute inset-0 flex items-center justify-center bg-white z-10 transition-all duration-300 ${isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl px-4 relative flex items-center">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-6 pr-16 py-3 bg-gray-100 rounded-full border-none focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none"
          />
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`absolute right-16 top-1/2 transform -translate-y-1/2 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-black'}`}
            title="Voice Search"
          >
            <FaMicrophone />
          </button>
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
          >
            <FaTimes />
          </button>
        </form>
      </div>
    </header>
  );
}
