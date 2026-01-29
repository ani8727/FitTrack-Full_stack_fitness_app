import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const userId = sessionStorage.getItem('userId');
  const token = sessionStorage.getItem('token');

  // Avoid sending custom headers on simple GET requests to prevent CORS preflights.
  const method = (config.method || 'get').toLowerCase();
  if (method !== 'get') {
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (userId) {
      config.headers = config.headers || {};
      config.headers['X-User-ID'] = userId;
    }
  }

  return config;
});

export default api;
