import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const userId = sessionStorage.getItem('userId');
  const token = sessionStorage.getItem('token');

  // Only attach auth/custom headers for mutating methods to keep GETs simple (no preflight).
  const mutatingMethods = new Set(['post', 'put', 'patch', 'delete']);
  const method = (config.method || 'get').toLowerCase();

  if (mutatingMethods.has(method)) {
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (userId) {
      config.headers = config.headers || {};
      config.headers['X-User-ID'] = userId;
    }
  } else {
    // Ensure no Content-Type or custom headers are present on GET/HEAD to avoid preflight
    if (config.headers) {
      const safe = {};
      // preserve standard accept header if present; drop others
      if (config.headers.Accept) safe.Accept = config.headers.Accept;
      config.headers = safe;
    }
  }

  return config;
});

export default api;
