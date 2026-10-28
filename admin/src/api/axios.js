import axios from "axios";
import { toast } from "react-toastify";

const statusMessages = {
  400: "The request is invalid.",
  401: "You are not authorized. Please sign in again.",
  403: "You do not have permission to perform this action.",
  404: "The requested resource was not found.",
  500: "A server error occurred. Please try again later.",
};

const getValidationMessages = (errors) => {
  if (!Array.isArray(errors)) {
    return [];
  }

  return errors
    .map((error) => (typeof error === "string" ? error : error?.message))
    .filter((message) => typeof message === "string" && message.trim());
};

export const showApiError = (error) => {
  const response = error?.response;
  const data = response?.data;
  const validationMessages = getValidationMessages(data?.errors);

  if (validationMessages.length > 0) {
    validationMessages.forEach((message) => toast.error(message));
    return validationMessages;
  }

  const message =
    data?.message ||
    statusMessages[response?.status] ||
    (response
      ? "The request could not be completed."
      : "Unable to connect to the server. Check your internet connection and try again.");

  toast.error(message);
  return [message];
};

const api = axios.create({
  baseURL: `${(import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/+$/, "")}/api`,
  withCredentials: true,
});

// Request interceptor - attach access token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor - handle token refresh on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip refresh for auth endpoints to avoid infinite loops
      if (originalRequest.url?.includes("/user/login") || 
          originalRequest.url?.includes("/user/admin-login") ||
          originalRequest.url?.includes("/user/refresh-token") ||
          originalRequest.url?.includes("/user/logout")) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Wait for the ongoing refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh token endpoint (uses httpOnly cookie)
        const response = await api.post("/user/refresh-token", {}, { skipErrorToast: true });
        
        if (response.data?.success && response.data?.accessToken) {
          const newAccessToken = response.data.accessToken;
          localStorage.setItem("adminToken", newAccessToken);
          
          // Process any queued requests
          processQueue(null, newAccessToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Refresh failed - clear auth and redirect to login
        localStorage.removeItem("adminToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (!error.config?.skipErrorToast) {
      showApiError(error);
    }
    return Promise.reject(error);
  }
);

export default api;