// API Configuration for Production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Fetch-based API client with axios-like interface
const api = {
  async request(config) {
    const url = config.url.startsWith('http') ? config.url : `${API_BASE_URL}${config.url}`;
    const token = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(config.headers || {}),
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const fetchConfig = {
      method: config.method || 'GET',
      headers,
      ...(config.data && { body: JSON.stringify(config.data) }),
    };
    
    try {
      const response = await fetch(url, fetchConfig);
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        const error = new Error(data.message || `HTTP ${response.status}`);
        error.response = { status: response.status, data };
        throw error;
      }
      
      return { data, status: response.status };
    } catch (error) {
      throw error;
    }
  },
  
  get(url, config = {}) {
    return this.request({ ...config, url, method: 'GET' });
  },
  
  post(url, data, config = {}) {
    return this.request({ ...config, url, data, method: 'POST' });
  },
  
  put(url, data, config = {}) {
    return this.request({ ...config, url, data, method: 'PUT' });
  },
  
  delete(url, config = {}) {
    return this.request({ ...config, url, method: 'DELETE' });
  },
  
  patch(url, data, config = {}) {
    return this.request({ ...config, url, data, method: 'PATCH' });
  },
};

export default api;