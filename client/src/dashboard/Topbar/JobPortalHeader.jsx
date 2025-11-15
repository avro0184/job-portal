'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaSearch, FaTimes } from "react-icons/fa";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Drawer, IconButton, List, ListItem, ListItemText } from "@mui/material";
import { useRouter } from "next/router";  // Import the useRouter hook

import DropdownUser from "@/dashboard/Topbar/DropdownUser";
import NotificationDropdown from "@/dashboard/Topbar/NotificationDropdown";
import LoginModal from "@/components/SignIn/LoginModal";
import useTranslate from "@/hooks/useTranslation";
import { getToken } from "@/utils/auth";
import { useSelector, useDispatch } from "react-redux";
import { setSearchInput } from "@/Redux/Search/SearchSlice";

export default function JobPortalHeader() {
  const dispatch = useDispatch();
  const { t } = useTranslate();
  const router = useRouter();  // Get the current router

  const userInfo = useSelector((s) => s.userInfo?.userInfo);
  const searchInput = useSelector((s) => s.search?.searchInput || "");

  const [token, setToken] = useState(getToken());
  const [searchText, setSearchText] = useState(searchInput);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const modalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => setSearchText(searchInput), [searchInput]);

  useEffect(() => {
    const updateToken = () => setToken(getToken());
    window.addEventListener("auth:token-changed", updateToken);
    return () => window.removeEventListener("auth:token-changed", updateToken);
  }, []);

  useEffect(() => {
    if (isSearchModalOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = "";
    }
  }, [isSearchModalOpen]);

  const handleSearchInput = (e) => {
    setSearchText(e.target.value);
    dispatch(setSearchInput(e.target.value));
  };

  const clearSearch = () => {
    setSearchText("");
    dispatch(setSearchInput(""));
  };

  const getLinkClass = (path) => {
    // Highlight active link with a blue color
    return router.pathname === path
      ? "text-primary font-semibold"  // Active class (Blue color)
      : "text-gray-200 hover:text-primary";  // Default link style
  };

  return (
    <>
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />

      {/* HEADER */}
      <header className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/60 border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4">

          {/* LOGO */}
          <Link href="/" className="flex items-center text-xl font-bold">
            Job Portal
          </Link>

          {/* NAVIGATION */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/jp/jobs" className={getLinkClass("/jp/jobs")}>
              {t("Jobs")}
            </Link>

            <Link href="/jp/career-roadmap" className={getLinkClass("/jp/career-roadmap")}>
              {t("Career Roadmap")}
            </Link>

            <Link href="/jp/resources" className={getLinkClass("/jp/resources")}>
              {t("Resources")}
            </Link>

            <Link href="/jp/career-bot" className={getLinkClass("/jp/career-bot")}>
              {t("AI Mentor")}
            </Link>

            <Link href="/jp/cv-template" className={getLinkClass("/jp/cv-template")}>
              {t("CV Builder")}
            </Link>
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {/* SEARCH BUTTON */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <FaSearch className="text-lg" />
            </button>

            {/* USER SECTION */}
            {userInfo?.id ? (
              <>
                <NotificationDropdown />
                <DropdownUser />
              </>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="bg-primary text-white px-4 py-2 rounded-full text-sm shadow hover:bg-primaryhover transition"
              >
                {t("Sign In")}
              </button>
            )}

            {/* MOBILE MENU */}
            <div className="md:hidden">
              <IconButton onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </header>

      {/* SEARCH MODAL */}
      {isSearchModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center p-6 z-50"
          onMouseDown={() => setIsSearchModalOpen(false)}
        >
          <div
            ref={modalRef}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white/80 dark:bg-gray-900/70 p-5 rounded-3xl shadow-xl backdrop-blur-md mt-20 md:mt-0"
          >
            {/* SEARCH INPUT */}
            <div className="flex items-center gap-3">
              <FaSearch className="text-lg" />
              <input
                ref={inputRef}
                value={searchText}
                onChange={handleSearchInput}
                placeholder={t("Search jobs, careers, skills…")}
                className="w-full bg-transparent focus:outline-none text-lg"
              />
              {searchText && (
                <button onClick={clearSearch} className="p-1 hover:bg-gray-200 rounded-full dark:hover:bg-gray-800">
                  <FaTimes />
                </button>
              )}
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl"
              >
                <CloseIcon />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE DRAWER */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="w-72 h-full bg-white dark:bg-gray-800 p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">{t("Menu")}</h3>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          <List>
            <ListItem button component={Link} href="/jp/jobs">
              <ListItemText primary={t("Jobs")} />
            </ListItem>

            <ListItem button component={Link} href="/jp/resources">
              <ListItemText primary={t("Resources")} />
            </ListItem>

            <ListItem button component={Link} href="/jp/career-roadmap">
              <ListItemText primary={t("Career Roadmap")} />
            </ListItem>

            <ListItem button component={Link} href="/jp/career-bot">
              <ListItemText primary={t("AI Mentor")} />
            </ListItem>

            <ListItem button component={Link} href="/jp/cv-template">
              <ListItemText primary={t("CV Builder")} />
            </ListItem>

            <div className="mt-4">
              {userInfo?.id ? (
                <span className="text-gray-700 dark:text-gray-200">
                  Logged In
                </span>
              ) : (
                <button
                  onClick={() => {
                    setLoginModalOpen(true);
                    setDrawerOpen(false);
                  }}
                  className="w-full bg-primary text-white py-2 rounded-md"
                >
                  {t("Sign In / Register")}
                </button>
              )}
            </div>
          </List>
        </div>
      </Drawer>
    </>
  );
}
