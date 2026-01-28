import api from "../../api/api";

export const getActivities = () => api.get('/activities');
export const addActivity = (activity) => api.post('/activities', activity);
export const getActivity = (id) => api.get(`/activities/${id}`);
export const getActivityRecommendation = (id) => api.get(`/ai/recommendations/activity/${id}`);
export const getActivityDetail = (id) => api.get(`/ai/recommendations/activity/${id}`); // Legacy compatibility

// Contact API (public)
export const sendContactMessage = (payload) => api.post('/contact', payload);
