import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set auth token
  const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem('token', token);
      // The token will be added to requests via the axios interceptor
    } else {
      localStorage.removeItem('token');
    }
  };

  // Load user
  const loadUser = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/me');
      
      if (res.data.success) {
        setUser(res.data.data);
        return { 
          success: true, 
          data: res.data.data 
        };
      } else {
        throw new Error(res.data.message || 'Failed to load user data');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error loading user';
      setError(errorMessage);
      // Clear token if there's an error loading user
      if (err.response?.status === 401) {
        setToken('');
        setUser(null);
        setAuthToken('');
      }
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (formData) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/register', formData);
      
      if (res.data.success && res.data.token) {
        setToken(res.data.token);
        setAuthToken(res.data.token);
        // Load user data after successful registration
        const userData = await loadUser();
        if (userData.success) {
          return { success: true, data: userData.data };
        } else {
          throw new Error('Failed to load user data');
        }
      } else {
        throw new Error(res.data.message || 'Registration failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/login', formData);
      
      if (res.data.success && res.data.token) {
        setToken(res.data.token);
        setAuthToken(res.data.token);
        
        // Load user data after successful login
        const userData = await loadUser();
        if (userData.success) {
          return { 
            success: true, 
            data: userData.data,
            token: res.data.token
          };
        } else {
          throw new Error('Failed to load user data');
        }
      } else {
        throw new Error(res.data.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    setToken('');
    setUser(null);
    setAuthToken('');
    return { success: true };
  };

  // Update user details
  const updateUser = async (formData) => {
    try {
      setLoading(true);
      const res = await api.put('/auth/updatedetails', formData);
      setUser(res.data.data);
      return { success: true, data: res.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
      return { 
        success: false, 
        error: err.response?.data?.message || 'Update failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      await api.put('/auth/updatepassword', {
        currentPassword,
        newPassword
      });
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Password update failed');
      return { 
        success: false, 
        error: err.response?.data?.message || 'Password update failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      await api.post('/auth/forgotpassword', { email });
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
      return { 
        success: false, 
        error: err.response?.data?.message || 'Password reset failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      setLoading(true);
      await api.put(`/auth/resetpassword/${token}`, { password });
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
      return { 
        success: false, 
        error: err.response?.data?.message || 'Password reset failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token;
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Initialize auth
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        setAuthToken(token);
        await loadUser();
      } else {
        setLoading(false);
      }
    };
    initializeAuth();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        updateUser,
        updatePassword,
        forgotPassword,
        resetPassword,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;