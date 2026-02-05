import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "";
const normalizedBaseUrl = rawBaseUrl
  ? rawBaseUrl.replace(/\/+$/, "").endsWith("/api")
    ? rawBaseUrl.replace(/\/+$/, "")
    : `${rawBaseUrl.replace(/\/+$/, "")}/api`
  : "";

const api = axios.create({
  baseURL: normalizedBaseUrl,
});

api.interceptors.request.use((config) => {
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");

  config.headers = config.headers || {};

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  if (userId) {
    config.headers["X-User-ID"] = userId;
  }

  return config;
});

export default api;
