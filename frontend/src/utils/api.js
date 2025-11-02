// API Configuration for Production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Configure axios defaults
import axios from 'axios';

// Set base URL for all axios requests
axios.defaults.baseURL = API_BASE_URL;

// Add request interceptor to handle authentication
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;