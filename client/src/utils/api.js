import axios from "axios";
import dotenv from "dotenv";
import Cookies from "js-cookie";
import { decryptData } from "@/utils/decrypt";
import { useRouter } from "next/router";
import { refreshToken, removeTokens } from "./auth";
dotenv.config();

// 1. Create clean API instance first
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Add Request Interceptor to dynamically set Accept-Language
api.interceptors.request.use(
  (config) => {
    const cookieLocale = Cookies.get("locale") || "bn"; // Always take fresh Cookie value
    config.headers["Accept-Language"] = cookieLocale;
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Refresh Access Token
const refreshAccessToken = async () => {
  try {
    const refresh = refreshToken();
    if (!refresh) {
      const router = useRouter();
      router.push("/signin");
    }

    const response = await api.post("/auth/token/refresh/", {
      refresh: refresh,
    });
    localStorage.setItem("access_token", response.data.access);
    return response.data.access;
  } catch (error) {
    throw error;
  }
};

// 4. Main API Request function
const apiRequest = async (
  endpoint,
  method,
  token = null,
  data = null,
  params = null,
  extraHeaders = {}
) => {
  try {
    const config = {
      url: endpoint,
      method: method.toUpperCase(),
      headers: {
        "Content-Type":
          data instanceof FormData ? "multipart/form-data" : "application/json",
        ...extraHeaders,
      },
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data && ["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
      config.data = data;
    }

    if (params) {
      const query = new URLSearchParams(params).toString();
      config.url = `${endpoint}?${query}`;
    }

    const response = await api(config);
    const raw = response?.data;
    return raw;
  } catch (error) {
    if (
      error.response?.status === 401 ||
      error.response?.data?.code === "token_not_valid"
    ) {
      try {
        const newAccessToken = await refreshAccessToken();
        return await apiRequest(endpoint, method, newAccessToken, data, params);
      } catch (refreshError) {
        removeTokens();
        const router = useRouter();
        router.push("/signin");
        throw refreshError;
      }
    }

    if (error.response?.data) {
      throw error.response.data;
    }
  }
};

export default apiRequest;
