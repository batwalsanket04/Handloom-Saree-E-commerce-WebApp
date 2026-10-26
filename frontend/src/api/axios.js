import axios from "axios";
import { showApiError } from "./apiErrorHandler";

const api = axios.create({
  baseURL: `${(import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/+$/, "")}/api`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    showApiError(error);
    return Promise.reject(error);
  }
);

export default api;
