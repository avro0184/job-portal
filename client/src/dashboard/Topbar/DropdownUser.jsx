"use client";

import React, { useState, useEffect, use } from "react";
import {
  Menu,
  MenuItem,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import {
  Logout,
  AccountCircle,
  Dashboard,
  Settings,
  Brightness4,
  Language,
} from "@mui/icons-material";
import Link from "next/link";
import { getToken, refreshToken, removeTokens } from "@/utils/auth";
import apiRequest from "@/utils/api";
import { getStatus } from "@/Redux/status/StatusSlice";
import { useSelector, useDispatch } from "react-redux";
import { setLanguage } from "@/Redux/Language/languageSlice";
import toast from "react-hot-toast";
import { decryptData } from "@/utils/decrypt";
import useTranslate from "@/hooks/useTranslation";
import Cookies from "js-cookie";
import { useThemeContext } from "@/context/ThemeProvider";
import { useRouter } from "next/router";

const DropdownUser = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const dropdownOpen = Boolean(anchorEl);
  const { locale, t } = useTranslate();
  const userInfo = useSelector((state) => state.userInfo.userInfo);
  const { isDark, setIsDark } = useThemeContext();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDark(savedTheme === "dark");
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      const accessToken = getToken();
      const refresh = refreshToken();

      const response = await apiRequest(
        process.env.NEXT_PUBLIC_API_LOGOUT,
        "POST",
        accessToken,
        { refresh_token: refresh }
      );

      if (response.success) {
        toast.success(response.message || "Logout successful");

        removeTokens();
        window.dispatchEvent(new Event("auth:token-changed"));

        router.push("/signin");
      }
    } catch (error) {
      toast.error("Logout failed.");
    }
  };


  useEffect(() => {
    if (userInfo && typeof window !== "undefined" && window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: "USER_INFO",
          userInfo: userInfo,
          token: getToken(),
        })
      );
    }

  }, [userInfo]);




  const toggleLanguage = () => {
    const newLang = locale === "en" ? "bn" : "en";
    dispatch(setLanguage(newLang));
    localStorage.setItem("lang", newLang);
  };

  return (
    <Box sx={{ position: "relative", zIndex: 50 }}>
      <Tooltip title={userInfo?.full_name || "User"} arrow>
        <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
          <Avatar
            className="border-2 text-primary font-bold border-primary bg-transparent"
            src={userInfo?.profile_image ? process.env.NEXT_PUBLIC_URL_DASHBOARD + userInfo?.profile_image : undefined}
            sx={{ width: 40, height: 40 }}
          >
            {!userInfo?.profile_image && (userInfo?.full_name?.charAt(0).toUpperCase() || "U")}
          </Avatar>

        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={dropdownOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          className:
            "mt-2 w-56 rounded-xl shadow-xl bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 overflow-hidden",
        }}
      >
        <MenuItem
          className="group hover:text-white"
          onClick={handleMenuClose}
          component={Link}
          href="/jp/feed"
        >
          <Dashboard className="mr-2 text-primary dark:text-white group-hover:text-white" />
          <span className="group-hover:text-white">{t("Dashboard")}</span>
        </MenuItem>
        <MenuItem
          className="group hover:text-white"
          onClick={handleMenuClose}
          component={Link}
          href="/jp/profile"
        >
          <AccountCircle className="mr-2 text-primary dark:text-white group-hover:text-white" />
          <span className="group-hover:text-white">{t("Profile")}</span>
        </MenuItem>

        <Divider className="my-1" />

        <MenuItem
          className="group hover:text-white"
          onClick={() => {
            setIsDark((prev) => !prev);
            handleMenuClose();
          }}
        >
          <Brightness4 className="mr-2 text-primary dark:text-white group-hover:text-white" />
          <span className="group-hover:text-white">
            {isDark ? t("Light Mode") : t("Dark Mode")}
          </span>
        </MenuItem>

        <MenuItem
          className="group hover:text-white"
          onClick={() => {
            toggleLanguage();
            handleMenuClose();
          }}
        >
          <Language className="mr-2 text-primary dark:text-white group-hover:text-white" />
          <span className="group-hover:text-white">
            {locale === "en" ? t("Bangla") : t("English")}
          </span>
        </MenuItem>

        <Divider className="my-1" />

        <MenuItem
          onClick={() => {
            handleLogout();
            handleMenuClose();
          }}
        >
          <Logout className="mr-2 text-red-500" />
          <span className="text-red-500">{t("Logout")}</span>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DropdownUser;
