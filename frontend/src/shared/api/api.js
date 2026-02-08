import {
	addActivity,
	getActivities,
	getActivityDetail as getActivityById,
	getActivityRecommendation,
	sendContactMessage,
} from "../../services/apiClient";

export { getActivities, addActivity, getActivityRecommendation, sendContactMessage };

// Keep existing component imports working
export const getActivity = (id) => getActivityById(id);

// Legacy compatibility: historically used for recommendation payload
export const getActivityDetail = (id) => getActivityRecommendation(id);
