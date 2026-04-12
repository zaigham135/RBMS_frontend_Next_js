import axios from "axios";
import { getToken, clearAuth } from "./auth";

// Use relative URL in browser (goes through Next.js proxy → avoids mixed content)
// Use full URL on server-side (SSR/API routes)
const baseURL = typeof window !== "undefined"
  ? ""  // browser: use relative path, proxied by Next.js rewrites
  : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL,
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 (token expiry)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
