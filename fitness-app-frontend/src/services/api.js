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


// Activity APIs
export const getActivities = () => api.get('/activities');
export const addActivity = (activity) => api.post('/activities', activity);
export const getActivityDetail = (id) => api.get(`/activities/${id}`);
export const deleteActivity = (id) => api.delete(`/activities/${id}`);
export const getActivityStats = () => api.get('/activities/stats');

// User APIs
export const registerUser = (userData) => api.post('/users/register', userData);
export const getUserProfile = (userId) => api.get(`/users/${userId}`);
export const updateUserProfile = (userId, userData) => api.put(`/users/${userId}`, userData);
export const validateUser = (userId) => api.get(`/users/${userId}/validate`);

// Admin Service APIs - User Management (uses same DB as userservice)
export const getDashboardStats = () => api.get('/admin/dashboard/stats');
export const getAllUsers = (role = null) => {
    let url = '/admin/users';
    if (role) url += `?role=${role}`;
    return api.get(url);
};
export const getUserById = (userId) => api.get(`/admin/users/${userId}`);
export const updateUserRole = (userId, role) => api.put(`/admin/users/${userId}/role`, { role });
export const deleteUser = (userId) => api.delete(`/admin/users/${userId}`);

// Legacy Admin - Activity APIs (still from activity service)
export const getAllActivities = () => api.get('/activities/admin/all');
export const getAdminActivityStats = () => api.get('/activities/admin/stats');
export const adminDeleteActivity = (activityId) => api.delete(`/activities/admin/${activityId}`);

// Recommendations API
export const getRecommendations = (userId) => api.get(`/recommendations/${userId}`);