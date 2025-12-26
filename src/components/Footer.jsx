import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterest } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-bold tracking-widest uppercase">
              ePro.
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Minimalist fashion for the modern individual. Quality, style, and sustainability in every piece.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white hover:text-gray-400 transition-colors"><FaFacebookF /></a>
              <a href="#" className="text-white hover:text-gray-400 transition-colors"><FaTwitter /></a>
              <a href="#" className="text-white hover:text-gray-400 transition-colors"><FaInstagram /></a>
              <a href="#" className="text-white hover:text-gray-400 transition-colors"><FaPinterest /></a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/products" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Best Sellers</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Accessories</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Sale</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Information</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent border border-gray-700 text-white px-4 py-3 text-sm focus:border-white focus:outline-none transition-colors rounded-md"
              />
              <button className="bg-white text-black px-6 py-3 uppercase tracking-widest text-xs font-bold hover:bg-gray-200 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} ePro. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}