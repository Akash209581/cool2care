import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import api from '@/utils/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        user: action.payload.user,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'AUTH_ERROR':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      dispatch({ type: 'AUTH_ERROR' });
      return;
    }

    try {
      const res = await api.get('/api/auth/me');
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: token,
          user: res.data,
        },
      });
    } catch (err) {
      localStorage.removeItem('token');
      dispatch({ type: 'AUTH_ERROR' });
    }
  }, []);

  // Register user
  const register = async (formData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await api.post('/api/auth/register', formData);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: res.data.token,
          user: res.data,
        },
      });
      toast.success('Registration successful!');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      dispatch({
        type: 'AUTH_ERROR',
        payload: message,
      });
      toast.error(message);
      return { success: false, message };
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await api.post('/api/auth/login', formData);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: res.data.token,
          user: res.data,
        },
      });
      toast.success('Login successful!');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      dispatch({
        type: 'AUTH_ERROR',
        payload: message,
      });
      toast.error(message);
      return { success: false, message };
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/api/auth/profile', profileData);
      dispatch({
        type: 'UPDATE_USER',
        payload: res.data,
      });
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Add address
  const addAddress = async (addressData) => {
    try {
      const res = await api.post('/api/auth/addresses', addressData);
      dispatch({
        type: 'UPDATE_USER',
        payload: { addresses: res.data.addresses },
      });
      toast.success('Address added successfully!');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add address';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Update address
  const updateAddress = async (addressId, addressData) => {
    try {
      const res = await api.put(`/api/auth/addresses/${addressId}`, addressData);
      dispatch({
        type: 'UPDATE_USER',
        payload: { addresses: res.data.addresses },
      });
      toast.success('Address updated successfully!');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update address';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Delete address
  const deleteAddress = async (addressId) => {
    try {
      const res = await api.delete(`/api/auth/addresses/${addressId}`);
      dispatch({
        type: 'UPDATE_USER',
        payload: { addresses: res.data.addresses },
      });
      toast.success('Address deleted successfully!');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete address';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully!');
  };

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
