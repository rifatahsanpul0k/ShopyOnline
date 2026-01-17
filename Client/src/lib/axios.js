import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:4000/api/v1"
    : "/api/v1";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor - Add token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData - let browser set it
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - Handle all errors centrally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Get error message from various sources
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    console.error("API Error:", {
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data,
    });

    // Handle different HTTP status codes
    switch (error.response?.status) {
      case 400:
        // Bad Request - validation errors
        toast.error(errorMessage);
        break;

      case 401: {
        // Unauthorized - wrong password or token expired
        // Check if this is a login/auth endpoint error (wrong password)
        const isLoginError = error.config?.url?.includes("/auth/login");

        if (isLoginError) {
          // Wrong password during login - just show error, don't redirect
          toast.error(errorMessage || "Invalid email or password");
        } else {
          // Token expired - logout and redirect
          localStorage.removeItem("token");
          toast.error("Session expired. Please login again.");
          setTimeout(() => {
            window.location.href = "/auth/login";
          }, 1000);
        }
        break;
      }

      case 403:
        // Forbidden - user doesn't have permission
        toast.error("You don't have permission to perform this action.");
        break;

      case 404:
        // Not Found
        toast.error("Resource not found.");
        break;

      case 409:
        // Conflict - email already exists, etc.
        toast.error(errorMessage);
        break;

      case 500:
        // Server Error
        toast.error("Server error. Please try again later.");
        break;

      case 503:
        // Service Unavailable
        toast.error(
          "Service is temporarily unavailable. Please try again later."
        );
        break;

      default:
        // Network error or other errors
        if (!error.response) {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error(errorMessage);
        }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
