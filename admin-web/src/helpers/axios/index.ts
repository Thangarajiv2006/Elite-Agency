import { login, logout } from "@/actions/auth.action";
import axios from "axios";

const API_BASE_URL = "https://eliteagency12.netlify.app/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Request interceptor - Add token to headers
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response interceptor - Handle common errors
 */
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data?.statusCode === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.store.dispatch(logout());
    }
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.data?.statusCode === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.store.dispatch(logout());
    }

    // Handle 403 Forbidden
    if (error.response?.data?.statusCode === 403) {
      console.error("Access forbidden");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
