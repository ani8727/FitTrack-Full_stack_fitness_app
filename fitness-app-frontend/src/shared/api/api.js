import axios from "axios";

const API_URL = 'http://localhost:8085/api'; // Updated to use the gateway port (8085) for routing requests

const api = axios.create({
    baseURL:API_URL
});

api.interceptors.request.use((config) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (userId) {
        config.headers['X-User-ID'] = userId;
    }
    return config;
}
);


export const getActivities = () => api.get('/activities');
export const addActivity = (activity) => api.post('/activities', activity);
export const getActivity = (id) => api.get(`/activities/${id}`);
export const getActivityRecommendation = (id) => api.get(`/recommendations/activity/${id}`);
export const getActivityDetail = (id) => api.get(`/recommendations/activity/${id}`); // Legacy compatibility
