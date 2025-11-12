"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import apiRequest from "@/utils/api";
import { setTokens, getToken } from "@/utils/auth";
import { getUserInfo } from "@/Redux/auth/UserInfoSlice";
import { decryptData } from "@/utils/decrypt";

const FacebookAuthButton = ({ onSuccess }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const isWeb = typeof window !== "undefined" && !window.ReactNativeWebView;

  // 📌 Native WebView listener
  useEffect(() => {
    if (!isWeb && typeof window !== "undefined") {
      const handleNativeFacebook = async (event) => {
        if (event.data?.type === "FACEBOOK_LOGIN") {
          try {
            const res = await apiRequest("/auth/facebook/", "POST", null, {
              access_token: event.data.token,
            });
            if (res.success) {
              setTokens(res.access, res.refresh);
              window.dispatchEvent(new Event("auth:token-changed"));
              await dispatch(getUserInfo(getToken()));
              onSuccess ? onSuccess(res) : router.push("/study");
            }
          } catch (err) {
            toast.error("Facebook login failed (native)");
          }
        }
      };
      window.addEventListener("message", handleNativeFacebook);
      return () => window.removeEventListener("message", handleNativeFacebook);
    }
  }, [isWeb, dispatch, onSuccess, router]);

  // 🌐 Web flow
  if (isWeb) {
    if (!mounted) return null;
    const FacebookLogin = require("react-facebook-login/dist/facebook-login-render-props").default;
    return (
      <FacebookLogin
        appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}
        autoLoad={false}
        fields="name,email,picture"
        callback={async (response) => {
          if (!response.accessToken) {
            toast.error("Facebook login failed");
            return;
          }
          try {
            const res = await apiRequest("/auth/facebook/", "POST", null, {
              access_token: response.accessToken,
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
            toast.error("Facebook login failed (web)");
          }
        }}
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
          >
            Continue with Facebook
          </button>
        )}
      />
    );
  }
  ``
  // 📱 Mobile WebView → trigger RN
  return (
    <button
      onClick={() => {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage("facebook-login");
        }
      }}
      className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
    >
      Continue with Facebook
    </button>
  );
};

export default FacebookAuthButton;
