import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const userId = sessionStorage.getItem('userId');
  const token = sessionStorage.getItem('token');

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  if (userId) {
    config.headers['X-User-ID'] = userId;
  }
  return config;
});

export default api;
