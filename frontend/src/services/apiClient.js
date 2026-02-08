import api from "../api/api";

// Activity APIs
export const getActivities = () => api.get('/activities');
export const addActivity = (activity) => api.post('/activities', activity);
export const getActivityDetail = (id) => api.get(`/activities/${id}`);
export const deleteActivity = (id) => api.delete(`/activities/${id}`);
export const getActivityStats = () => api.get('/activities/stats');

// AI activity recommendation (legacy UI call)
export const getActivityRecommendation = (activityId) => api.get(`/ai/recommendations/activity/${activityId}`);

// User APIs
export const registerUser = (userData) => api.post('/users/register', userData);
export const getUserProfile = (userId) => api.get(`/users/${userId}`);
export const updateUserProfile = (userId, userData) => api.put(`/users/${userId}/profile`, userData);
export const validateUser = (userId) => api.get(`/users/${userId}/validate`);

// Self-profile APIs (avoid passing Auth0 id in path)
export const getMyProfile = () => api.get('/users/me/profile');
export const updateMyProfile = (userData) => api.put('/users/me/profile', userData);

// Admin Service APIs - User Management (route through gateway /admin)
export const getDashboardStats = () => api.get('/admin/stats');
export const getAllUsers = (filters = {}) => {
  const params = {};
  if (filters.search) params.search = filters.search;
  if (filters.role) params.role = filters.role;
  if (filters.status) params.status = filters.status;
  return api.get('/admin/users', { params });
};
export const getUserById = (userId) => api.get(`/users/${userId}`);
export const updateUserRole = (userId, role) => api.put(`/admin/users/${userId}/role`, { role });
export const deleteUser = (userId) => api.delete(`/admin/users/${userId}`);
export const updateUserStatus = (userId, status, reason) => api.put(`/admin/users/${userId}/status`, { status, reason });

// Admin - Activity APIs
export const getAllActivities = () => api.get('/admin/activities');
export const getAdminActivityStats = () => api.get('/admin/activities/stats');
export const adminDeleteActivity = (activityId) => api.delete(`/admin/activities/${activityId}`);

// AI Recommendations (route through gateway /ai)
export const getRecommendations = (userId) => api.get(`/ai/recommendations/user/${userId}`);
export const generateRecommendation = (activityId) => api.post(`/ai/recommendations/generate/${activityId}`);

// Daily Plan APIs
export const generateDailyPlan = (userId, date) => api.post(`/daily-plans/generate/${userId}?date=${date}`);
export const getDailyPlanByDate = (userId, date) => api.get(`/daily-plans/user/${userId}/date/${date}`);

// Account Management APIs
export const deactivateAccount = (userId, data) => api.post(`/users/${userId}/deactivate`, data);
export const deleteAccount = (userId, data) => api.post(`/users/${userId}/delete`, data);
export const reactivateAccount = (userId) => api.post(`/users/${userId}/reactivate`);

// Self account management APIs (avoid passing Auth0 id in path)
export const deactivateMyAccount = (data) => api.post('/users/me/deactivate', data);
export const deleteMyAccount = (data) => api.post('/users/me/delete', data);
export const reactivateMyAccount = () => api.post('/users/me/reactivate');

// Onboarding APIs
export const completeOnboarding = (userId) => api.post(`/users/${userId}/onboarding/complete`);
export const getOnboardingStatus = (userId) => api.get(`/users/${userId}/onboarding/status`);
export const completeMyOnboarding = () => api.post('/users/me/onboarding/complete');
export const getMyOnboardingStatus = () => api.get('/users/me/onboarding/status');
export const getUserDailyPlans = (userId, startDate, endDate) => {
  let url = `/daily-plans/user/${userId}`;
  if (startDate && endDate) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  }
  return api.get(url);
};

// Contact API (public)
export const sendContactMessage = (payload) => api.post('/contact', payload);
