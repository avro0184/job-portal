'use client';

import Loader from "@/components/Loader/Loader";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import apiRequest from "@/utils/api";
import Link from "next/link";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import FloatingSettings from "@/components/common/FloatingSettings";
import useTranslate from "@/hooks/useTranslation";

export default function Signup() {
  const router = useRouter();
  const { t } = useTranslate();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [formErrors, setFormErrors] = useState({ full_name: "", email: "", password: "", confirmPassword: "" });
  const [hasEmailText, setHasEmailText] = useState(false);
  const [hasFullNameText, setHasFullNameText] = useState(false);
  const [hasPasswordText, setHasPasswordText] = useState(false);
  const [hasConfirmPasswordText, setHasConfirmPasswordText] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

 const validateForm = () => {
  const errors = {};

  if (!formData.full_name.trim()) {
    errors.full_name = "Full name is required";
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!formData.email.includes("@")) {
    errors.email = "Invalid email address";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Confirm Password is required";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await apiRequest(
        process.env.NEXT_PUBLIC_API_ENDPOINT_SIGNUP,
        "POST",
        null,
        {
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password
        }
      );

      if (response.success) {
        toast.success(response.message);
        router.push("/signin");
      }
    } catch (error) {
      if (error) {
        setFormErrors({
          full_name: error?.full_name?.[0] || "",
          email: error?.email?.[0] || "",
          password: error?.password?.[0] || "",
          confirmPassword: error?.confirmPassword?.[0] || "",
        });

        toast.error("Signup failed. Please check your inputs.");
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="dark:text-white">
        <Header />

        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl p-8">
            <h1 className="text-2xl mb-6 font-bold text-center text-gray-900 dark:text-white">
              {t("Sign Up")}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="relative">
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder=" "
                  onBlur={(e) => setHasFullNameText(!!e.target.value)}
                  className="peer w-full bg-transparent border-b-2 border-primary text-sm px-0 py-2 pr-8 text-gray-900 dark:text-white placeholder-transparent focus:outline-none"
                />
                <label
                  htmlFor="full_name"
                  className={`absolute left-0 transition-all duration-200 text-gray-500 dark:text-gray-300 ${hasFullNameText ? 'top-[-10px] text-xs' : 'top-2 text-base'
                    } peer-focus:top-[-10px] peer-focus:text-xs`}
                >
                  {t("Full Name")}
                </label>
                {formErrors.full_name && <p className="text-xs text-red-600 mt-1">{formErrors.full_name}</p>}
              </div>

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
                  className="peer w-full bg-transparent border-b-2 border-primary text-sm px-0 py-2 pr-8 text-gray-900 dark:text-white placeholder-transparent focus:outline-none"
                />
                <label
                  htmlFor="email"
                  className={`absolute left-0 transition-all duration-200 text-gray-500 dark:text-gray-300 ${hasEmailText ? 'top-[-10px] text-xs' : 'top-2 text-base'
                    } peer-focus:top-[-10px] peer-focus:text-xs`}
                >
                  {t('Email Address')}
                </label>
                {formErrors.email && <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>}
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
                  onBlur={(e) => setHasPasswordText(!!e.target.value)}
                  className="peer w-full bg-transparent border-b-2 border-primary text-sm px-0 py-2 pr-8 text-gray-900 dark:text-white placeholder-transparent focus:outline-none"
                />
                <label
                  htmlFor="password"
                  className={`absolute left-0 transition-all duration-200 text-gray-500 dark:text-gray-300 ${hasPasswordText ? 'top-[-10px] text-xs' : 'top-2 text-base'
                    } peer-focus:top-[-10px] peer-focus:text-xs`}
                >
                  {t("Password")}
                </label>
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-0 top-2 text-gray-500 dark:text-gray-300"
                >
                  {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                </button>
                {formErrors.password && <p className="text-xs text-red-600 mt-1">{formErrors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={confirmPasswordVisible ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder=" "
                  onBlur={(e) => setHasConfirmPasswordText(!!e.target.value)}
                  className="peer w-full bg-transparent border-b-2 border-primary text-sm px-0 py-2 pr-8 text-gray-900 dark:text-white placeholder-transparent focus:outline-none"
                />
                <label
                  htmlFor="confirmPassword"
                  className={`absolute left-0 transition-all duration-200 text-gray-500 dark:text-gray-300 ${hasConfirmPasswordText ? 'top-[-10px] text-xs' : 'top-2 text-base'
                    } peer-focus:top-[-10px] peer-focus:text-xs`}
                >
                  {t("Confirm Password")}
                </label>
                <button
                  type="button"
                  onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  className="absolute right-0 top-2 text-gray-500 dark:text-gray-300"
                >
                  {confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                </button>
                {formErrors.confirmPassword && <p className="text-xs text-red-600 mt-1">{formErrors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary hover:bg-primaryhover text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-300"
              >
                {t("Sign Up")}
              </button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                {t("Already have an account?")} {" "}
                <Link href="/signin" className="text-primary font-semibold hover:underline">
                  {t("Sign In")}
                </Link>
              </p>
            </form>
          </div>
        </div>

        <Footer />
        <FloatingSettings />
      </div>
    </>
  );
}

Signup.getLayout = (page) => page;
