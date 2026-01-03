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
export const updateUserProfile = (userId, userData) => api.put(`/users/${userId}/profile`, userData);
export const validateUser = (userId) => api.get(`/users/${userId}/validate`);

// Admin Service APIs - User Management
export const getDashboardStats = () => api.get('/users/admin/stats');
export const getAllUsers = (filters = {}) => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.role) params.role = filters.role;
    if (filters.status) params.status = filters.status;
    return api.get('/users/admin/all', { params });
};
export const getUserById = (userId) => api.get(`/users/${userId}`);
export const updateUserRole = (userId, role) => api.put(`/users/admin/${userId}/role`, { role });
export const deleteUser = (userId) => api.delete(`/users/admin/${userId}`);
export const updateUserStatus = (userId, status, reason) => api.put(`/users/admin/${userId}/status`, { status, reason });

// Legacy Admin - Activity APIs (still from activity service)
export const getAllActivities = () => api.get('/activities/admin/all');

// AI Recommendations
export const getRecommendations = (userId) => api.get(`/recommendations/user/${userId}`);
export const generateRecommendation = (activityId) => api.post(`/recommendations/generate/${activityId}`);
export const getAdminActivityStats = () => api.get('/activities/admin/stats');
export const adminDeleteActivity = (activityId) => api.delete(`/activities/admin/${activityId}`);

// Daily Plan APIs
export const generateDailyPlan = (userId, date) => api.post(`/daily-plans/generate/${userId}?date=${date}`);
export const getDailyPlanByDate = (userId, date) => api.get(`/daily-plans/user/${userId}/date/${date}`);
export const getUserDailyPlans = (userId, startDate, endDate) => {
    let url = `/daily-plans/user/${userId}`;
    if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return api.get(url);
};

// Account Management APIs
export const deactivateAccount = (userId, data) => api.post(`/users/${userId}/deactivate`, data);
export const deleteAccount = (userId, data) => api.delete(`/users/${userId}/delete`, { data });
export const reactivateAccount = (userId) => api.post(`/users/${userId}/reactivate`);

// Onboarding APIs
export const completeOnboarding = (userId) => api.post(`/users/${userId}/onboarding/complete`);
export const getOnboardingStatus = (userId) => api.get(`/users/${userId}/onboarding/status`);