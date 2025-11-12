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
    const cookieLocale = Cookies.get("locale") || "bn";  // Always take fresh Cookie value
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
const apiRequest = async (endpoint, method, token = null, data = null, params = null , extraHeaders = {}) => {
  try {
    const config = {
      url: endpoint,
      method: method.toUpperCase(),
      headers: {
        "Content-Type": data instanceof FormData ? "multipart/form-data" : "application/json",
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
    if ((response.status === 200 || response.status === 201 || response.status === 202) && raw?.success === true) {
      let { data, own_data, question_sets, exam_name, subject_based_sets , questions , pagination , exam_window ,  summary , is_open , is_creator} = raw;
    
      try {
        if (typeof data === "string") data = decryptData(data);
        if (typeof is_open === "string") is_open = decryptData(is_open);
        if (typeof pagination === "string") pagination = decryptData(pagination);
        if (typeof exam_window === "string") exam_window = decryptData(exam_window);
        if (typeof summary === "string") summary = decryptData(summary);
        if (typeof own_data === "string") own_data = decryptData(own_data);
        if (typeof question_sets === "string") question_sets = decryptData(question_sets);
        if (typeof exam_name === "string") exam_name = decryptData(exam_name);
        if (typeof subject_based_sets === "string") subject_based_sets = decryptData(subject_based_sets);
        if (typeof questions === "string") questions = decryptData(questions);
        if (typeof is_creator === "string") is_creator = decryptData(is_creator);
      } catch (err) {
        // console.error("Decryption failed, using raw values.");
      }
    
      return {
        success: true,
        message: raw.message,
        refresh: raw.refresh,
        access: raw.access,
        email: raw.email,
        data,
        own_data,
        question_sets,
        exam_name,
        subject_based_sets,
        questions,
        pagination,
        exam_window,
        summary , 
        is_open,
        is_creator
      };    
    } else {
      try {
        const decrypted = decryptData(raw);
        return decrypted;
      } catch (err) {
        return raw;
      }
    }
  } catch (error) {
    if (error.response?.status === 401 || error.response?.data?.code === "token_not_valid") {
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
