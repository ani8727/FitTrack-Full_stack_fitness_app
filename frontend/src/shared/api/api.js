import axios from "axios";
import { apiBaseUrl } from "../../authConfig";

const API_URL = apiBaseUrl;

if (!API_URL) {
    throw new Error('VITE_API_BASE_URL is not configured. Set it in your .env file.');
}

const api = axios.create({
    baseURL: API_URL
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
}
);


export const getActivities = () => api.get('/api/activities');
export const addActivity = (activity) => api.post('/api/activities', activity);
export const getActivity = (id) => api.get(`/api/activities/${id}`);
export const getActivityRecommendation = (id) => api.get(`/api/recommendations/activity/${id}`);
export const getActivityDetail = (id) => api.get(`/api/recommendations/activity/${id}`); // Legacy compatibility

// Contact API (public)
export const sendContactMessage = (payload) => api.post('/contact', payload);
