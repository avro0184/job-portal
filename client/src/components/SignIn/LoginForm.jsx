"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import apiRequest from "@/utils/api";
import useTranslate from "@/hooks/useTranslation";
import Loader from "@/components/Loader/Loader";
import { useDispatch } from "react-redux";
import { getUserInfo } from "@/Redux/auth/UserInfoSlice";
import { setTokens, getToken } from "@/utils/auth"; // ✅ hybrid helpers
import { decryptData } from "@/utils/decrypt";

// 👇 dynamically import Google & Facebook login (client only)
const GoogleAuthButton = dynamic(() => import("./GoogleAuthButton"), {
  ssr: false,
});

const FacebookAuthButton = dynamic(() => import("./FacebookAuthButton"), {
  ssr: false,
});

const LoginForm = ({ onSuccess }) => {
  const router = useRouter();
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasEmailText, setHasEmailText] = useState(false);
  const [hasPasswordText, setHasPasswordText] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });

    if (name === "email") setHasEmailText(!!value);
    if (name === "password") setHasPasswordText(!!value);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = t("Email is required");
    else if (!formData.email.includes("@"))
      errors.email = t("Email must contain @");

    if (!formData.password) errors.password = t("Password is required");
    else if (formData.password.length < 6)
      errors.password = t("Password must be at least 6 characters");

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await apiRequest(
        process.env.NEXT_PUBLIC_API_LOGIN,
        "POST",
        null,
        formData
      );
      if (result.success) {
        // ✅ Save tokens Hybrid way
        setTokens(result.access, result.refresh);

        window.dispatchEvent(new Event("auth:token-changed"));

        await dispatch(getUserInfo(getToken()));

        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: "AUTH_TOKEN",
              access: decryptData(result.access),
              refresh: decryptData(result.refresh),
            })
          );
        }

        if (onSuccess) onSuccess(result);
        else router.push("/study");
      }
    } catch (error) {
      setFormErrors({ password: error.error });
      toast.error(error.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {loading && <Loader />}
      <div className="flex justify-center items-center gap-4 mt-4 mb-8 flex-wrap">
        {typeof window !== "undefined" && !window.ReactNativeWebView && (
          <>
            {/* Google Login */}
            <div className="h-10 flex items-center">
              <GoogleAuthButton onSuccess={onSuccess} />
            </div>

            {/* Facebook Login */}
            <div className="h-10 flex items-center">
              <FacebookAuthButton onSuccess={onSuccess} />
            </div>
          </>
         )}
      </div>


      <h1 className="text-lg md:text-2xl mb-10 font-extrabold text-center">
        {t("Login")}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder=" "
            autoComplete="email"
            onBlur={(e) => setHasEmailText(!!e.target.value)}
            className="peer w-full bg-transparent border-b-2 border-primary text-sm px-0 py-2 pr-8 placeholder-transparent focus:outline-none"
          />
          <label
            htmlFor="email"
            className={`absolute left-0 transition-all duration-200 ${hasEmailText ? "top-[-10px] text-xs" : "top-2 text-base"
              } peer-focus:top-[-10px] peer-focus:text-xs`}
          >
            {t("Email Address")}
          </label>
          {formErrors.email && (
            <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <input
            id="password"
            name="password"
            type={passwordVisible ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder=" "
            autoComplete="current-password"
            onBlur={(e) => setHasPasswordText(!!e.target.value)}
            className="peer w-full bg-transparent border-b-2 border-primary text-sm px-0 py-2 pr-8 placeholder-transparent focus:outline-none"
          />
          <label
            htmlFor="password"
            className={`absolute left-0 transition-all duration-200 ${hasPasswordText ? "top-[-10px] text-xs" : "top-2 text-base"
              } peer-focus:top-[-10px] peer-focus:text-xs`}
          >
            {t("Password")}
          </label>
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute right-0 top-2"
          >
            {passwordVisible ? <FaEye /> : <FaEyeSlash />}
          </button>
          {formErrors.password && (
            <p className="text-xs text-red-600 mt-1">{formErrors.password}</p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <a href="/forgot-password" className="text-sm text-primary hover:underline">
            {t("Forgot password?")}
          </a>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-primary hover:bg-primaryhover text-white font-semibold rounded-lg shadow-md transition duration-300"
        >
          {t("Sign In")}
        </button>

        {/* Sign Up */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          {t("Don't have an account yet?")}{" "}
          <a
            href="/signup"
            className="text-primary font-semibold underline hover:underline"
          >
            {t("Sign Up")}
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
