import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://multitenant-backend.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token to headers
apiClient.interceptors.request.use(
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

// Response interceptor: handle token expiration / unauthorized response
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and reload or redirect if unauthorized
      localStorage.removeItem('token');
      // If we are not already on the login page, redirect
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
