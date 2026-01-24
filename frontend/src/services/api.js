import axios from "axios";
import { apiBaseUrl } from "../authConfig";

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


// Activity APIs
export const getActivities = () => api.get('/api/activities');
export const addActivity = (activity) => api.post('/api/activities', activity);
export const getActivityDetail = (id) => api.get(`/activities/${id}`);
export const deleteActivity = (id) => api.delete(`/activities/${id}`);
export const getActivityStats = () => api.get('/api/activities/stats');

// User APIs
export const registerUser = (userData) => api.post('/users/register', userData);
export const registerUser = (userData) => api.post('/api/users/register', userData);
export const getUserProfile = (userId) => api.get(`/users/${userId}`);
export const getUserProfile = (userId) => api.get(`/api/users/${userId}`);
export const updateUserProfile = (userId, userData) => api.put(`/users/${userId}/profile`, userData);
export const updateUserProfile = (userId, userData) => api.put(`/api/users/${userId}/profile`, userData);
export const validateUser = (userId) => api.get(`/users/${userId}/validate`);
export const validateUser = (userId) => api.get(`/api/users/${userId}/validate`);

// Admin Service APIs - User Management
export const getDashboardStats = () => api.get('/users/admin/stats');
export const getDashboardStats = () => api.get('/api/users/admin/stats');
export const getAllUsers = (filters = {}) => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.role) params.role = filters.role;
    if (filters.status) params.status = filters.status;
    return api.get('/api/users/admin/all', { params });
};
export const getUserById = (userId) => api.get(`/api/users/${userId}`);
export const updateUserRole = (userId, role) => api.put(`/api/users/admin/${userId}/role`, { role });
export const deleteUser = (userId) => api.delete(`/api/users/admin/${userId}`);
export const updateUserStatus = (userId, status, reason) => api.put(`/api/users/admin/${userId}/status`, { status, reason });

// Legacy Admin - Activity APIs (still from activity service)
export const getAllActivities = () => api.get('/api/activities/admin/all');

// AI Recommendations
export const getRecommendations = (userId) => api.get(`/recommendations/user/${userId}`);
export const generateRecommendation = (activityId) => api.post(`/recommendations/generate/${activityId}`);
export const getAdminActivityStats = () => api.get('/api/activities/admin/stats');
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
export const deactivateAccount = (userId, data) => api.post(`/api/users/${userId}/deactivate`, data);
export const deleteAccount = (userId, data) => api.post(`/users/${userId}/delete`, data);
export const deleteAccount = (userId, data) => api.post(`/api/users/${userId}/delete`, data);
export const reactivateAccount = (userId) => api.post(`/users/${userId}/reactivate`);
export const reactivateAccount = (userId) => api.post(`/api/users/${userId}/reactivate`);

// Onboarding APIs
export const completeOnboarding = (userId) => api.post(`/users/${userId}/onboarding/complete`);
export const completeOnboarding = (userId) => api.post(`/api/users/${userId}/onboarding/complete`);
export const getOnboardingStatus = (userId) => api.get(`/users/${userId}/onboarding/status`);
export const getOnboardingStatus = (userId) => api.get(`/api/users/${userId}/onboarding/status`);
export const generateDailyPlan = (userId, date) => api.post(`/api/daily-plans/generate/${userId}?date=${date}`);
export const getDailyPlanByDate = (userId, date) => api.get(`/api/daily-plans/user/${userId}/date/${date}`);
export const getUserDailyPlans = (userId, startDate, endDate) => {
    let url = `/api/daily-plans/user/${userId}`;
    if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return api.get(url);
};

// Contact API (public)
export const sendContactMessage = (payload) => api.post('/contact', payload);