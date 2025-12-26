// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import Header from './components/Header';
import Footer from './components/Footer';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import ProtectedRoute from './components/routing/ProtectedRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Dashboard/Profile';
import Settings from './pages/Dashboard/Settings';
import ManageProducts from './pages/Dashboard/ManageProducts';
import AddProduct from './pages/Dashboard/AddProduct';
import Orders from './pages/Dashboard/Orders';
import OrderDetail from './pages/Dashboard/OrderDetail';
import Users from './pages/Dashboard/Users';
import ManageFeedback from './pages/Dashboard/ManageFeedback';
import HeroSlides from './pages/Dashboard/Visuals/HeroSlides';
import Collections from './pages/Dashboard/Visuals/Collections';
import Trending from './pages/Dashboard/Visuals/Trending';
import Categories from './pages/Dashboard/Visuals/Categories';
import OrderSuccess from './pages/OrderSuccess';
import NotFound from './pages/NotFound';

import ScrollToTop from './components/ScrollToTop';

function App() {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  return (
    <ToastProvider>
      <WishlistProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <ScrollToTop />
          <Header />
          <main className="flex-1 pt-16">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/wishlist" element={<Wishlist />} />
              {/* Public admin login route (uses same login page, different path) */}
              <Route path="/admin/login" element={<Login />} />
              <Route
                path="/login"
                element={isAuthenticated() ? <Navigate to="/dashboard/profile" state={{ from: location }} replace /> : <Login />}
              />
              <Route
                path="/register"
                element={isAuthenticated() ? <Navigate to="/dashboard/profile" state={{ from: location }} replace /> : <Register />}
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Protected checkout route */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order-success"
                element={
                  <ProtectedRoute>
                    <OrderSuccess />
                  </ProtectedRoute>
                }
              />

              {/* Protected Dashboard Routes */}
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <DashboardLayout isAdmin={isAdmin()} />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="products" element={<ManageProducts />} />
                <Route path="products/add" element={<AddProduct />} />
                <Route path="products/edit/:id" element={<AddProduct />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:id" element={<OrderDetail />} />
                <Route path="users" element={<Users />} />
                <Route path="feedback" element={<ManageFeedback />} />
                <Route path="visuals/hero" element={<HeroSlides />} />
                <Route path="visuals/collections" element={<Collections />} />
                <Route path="visuals/trending" element={<Trending />} />
                <Route path="visuals/categories" element={<Categories />} />
              </Route>

              {/* 404 Route - Catch all unmatched routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />

        </div>
      </WishlistProvider>
    </ToastProvider>
  );
}

export default App;