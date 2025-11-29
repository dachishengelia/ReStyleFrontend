import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_BASE // Use local backend in development
    : import.meta.env.VITE_API_BASE_PROD, // Use Vercel backend in production
  withCredentials: true, // Include cookies in requests
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/auth"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
