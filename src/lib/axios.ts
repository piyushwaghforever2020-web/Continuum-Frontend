import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//  Request Interceptor (Attach Token)
api.interceptors.request.use(
  (config) => {
    const requestUrl = String(config.url ?? "");
    const token =
      typeof window !== "undefined"
        ? requestUrl.startsWith("/employer")
          ? localStorage.getItem("session_token")
          : localStorage.getItem("admin_token")
        : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

//  Response Interceptor (Global Error Handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = String(error?.response?.data?.message ?? "");

    // Handle auth failures globally without exposing backend token errors in UI.
    if (status === 401 || message.toLowerCase().includes("authentication token is required")) {
      if (typeof window !== "undefined") {
        if (window.location.pathname.startsWith("/employer")) {
          localStorage.removeItem("session_token");
        } else {
          localStorage.removeItem("admin_token");
        }

        if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
          window.location.replace("/admin/login");
        }
      }
    }

    // Keep original axios error shape instead of throwing a new raw backend error.
    return Promise.reject(error);
  }
);
