"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import apiRequest from "@/utils/api";
import { setTokens, getToken } from "@/utils/auth";
import { useDispatch } from "react-redux";
import { getUserInfo } from "@/Redux/auth/UserInfoSlice";
import { decryptData } from "@/utils/decrypt";

const GoogleAuthButton = ({ onSuccess }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => setMounted(true), []);

  const isWeb = typeof window !== "undefined" && !window.ReactNativeWebView;

  // 📌 Native WebView listener
  useEffect(() => {
    if (!isWeb && typeof window !== "undefined") {
      const handleNativeGoogle = async (event) => {
        if (event.data?.type === "GOOGLE_LOGIN") {
          try {
            const res = await apiRequest("/auth/google/", "POST", null, {
              id_token: event.data.token,
            });
            if (res.success) {
              setTokens(res.access, res.refresh);
              window.dispatchEvent(new Event("auth:token-changed"));
              await dispatch(getUserInfo(getToken()));
              onSuccess ? onSuccess(res) : router.push("/study");
            }
          } catch (err) {
            toast.error("Google login failed (native)");
          }
        }
      };
      window.addEventListener("message", handleNativeGoogle);
      return () => window.removeEventListener("message", handleNativeGoogle);
    }
  }, [isWeb, dispatch, onSuccess, router]);

  // 🌐 Web flow
  if (isWeb) {
    if (!mounted) return null;
    const { GoogleLogin } = require("@react-oauth/google");

    return (
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            const res = await apiRequest("/auth/google/", "POST", null, {
              id_token: credentialResponse.credential,
            });
            if (res.success) {
              setTokens(res.access, res.refresh);
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
              onSuccess ? onSuccess(res) : router.push("/study");
            }
          } catch (err) {
            console.log(err);
            toast.error("Google login failed (web)");
          }
        }}
        onError={() => toast.error("Google login failed")}
      />
    );
  }

  // 📱 Mobile (WebView button → trigger RN)
  return (
    <button
      onClick={() => {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage("google-login");
        }
      }}
      className="h-10 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
    >
      Continue with Google
    </button>
  );
};

export default GoogleAuthButton;
