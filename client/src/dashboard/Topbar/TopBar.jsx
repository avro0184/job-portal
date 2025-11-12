import { useDashboardContext } from "../Provider";
import DropdownUser from "./DropdownUser";
import NotificationDropdown from "./NotificationDropdown";
import useTranslate from "@/hooks/useTranslation";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { use, useEffect, useState } from "react";
import LoginModal from "@/components/SignIn/LoginModal";
import { getToken } from "@/utils/auth";
import { useDispatch } from "react-redux";
import { setSearchInput } from "@/Redux/Search/SearchSlice"; // adjust path

export function TopBar() {
  const dispatch = useDispatch();
  const { t } = useTranslate();
  const { sidebarOpen, setSidebarOpen } = useDashboardContext();
  const { userInfo } = useSelector((state) => state.userInfo); // ✅ Redux user info
  const [token, setToken] = useState(getToken()); // ✅ local state

  useEffect(() => {
    const updateToken = () => setToken(getToken());
    window.addEventListener("auth:token-changed", updateToken);
    return () => window.removeEventListener("auth:token-changed", updateToken);
  }, []);

  const searchInput = useSelector((state) => state.search.searchInput); // ✅ the value from store

  const [searchText, setSearchText] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

const handleSearchInput = (e) => {
    setSearchText(e.target.value);
    dispatch(setSearchInput(e.target.value)); // ✅ dispatch action
  };

  const clearSearchInput = () => {
    setSearchText("");
    dispatch(setSearchInput("")); // ✅ clear in store
  };
  

  return (
    <>
      <LoginModal isOpen={loginModalOpen} onClose={setLoginModalOpen} />

      {/* 🔍 If mobile search is open, show search bar instead of topbar */}
      {mobileSearchOpen ? (
        <div className="block md:hidden px-3 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <FaSearch className="text-gray-600 dark:text-gray-300" />
            <input
              type="text"
              value={searchText}
              onChange={handleSearchInput}
              autoFocus
              placeholder={t("Search")}
              className="flex-1 h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <FaTimes
              className="cursor-pointer text-gray-500 hover:text-red-500"
              onClick={() => {clearSearchInput(); setMobileSearchOpen(false);}}
            />
          </div>
        </div>
      ) : (
        <header className="relative z-0 md:mt-3 py-1 items-center border-b border-primary bg-white dark:bg-gray-900">
          <div className="relative z-0 mx-auto flex h-full flex-col justify-center md:px-3 py-1 md:py-0">
            <div className="relative flex w-full items-center pe-1 sm:ml-0 sm:pr-2 justify-between">
              {/* Logo & Sidebar button */}
              <div className="group relative flex h-full w-auto items-center justify-center md:ms-2 md:ms-5">
                <Link href="/">
                  <span className=" md:hidden block font-bold text-primary dark:text-white">
                    {t("Job Portal")}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-4xl hidden md:block text-primary dark:text-white focus:outline-none flex justify-center items-center"
                >
                  &#8801;
                </button>
              </div>

              {/* Desktop Search */}
              <div className="container relative left-0 flex w-full items-center justify-between">
                <div className="group relative ml-8 hidden w-full items-center md:flex w-auto">
                  <FaSearch className="pointer-events-none absolute left-0 ml-4 hidden h-4 w-4 text-gray-900 dark:text-gray-300 group-hover:text-gray-900 sm:block" />
                  <input
                    type="text"
                    value={searchText}
                    onChange={handleSearchInput}
                    className="block h-14 border border-primaryhover w-full rounded-2xl dark:bg-gray-800 py-1.5 pl-10 pr-10 leading-normal text-gray-900 dark:text-gray-100 opacity-90 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t("Search")}
                  />
                  {searchText && (
                    <FaTimes
                      className="absolute right-3 h-4 w-4 text-gray-400 cursor-pointer hover:text-red-500"
                      onClick={clearSearchInput}
                    />
                  )}
                </div>
              </div>

              {/* User / Notification */}
              <div className="relative ml-5 flex items-center justify-end gap-4">
                {/* Mobile Search Button */}
                <div className="md:hidden block">
                  <FaSearch
                    size={18}
                    className="text-gray-600 dark:text-gray-300 cursor-pointer"
                    onClick={() => setMobileSearchOpen(true)}
                  />
                </div>

                {userInfo?.id ? (
                  <>
                    <NotificationDropdown />
                    <DropdownUser />
                  </>
                ) : (
                  <button
                    onClick={() => setLoginModalOpen(true)}
                    className="bg-primary text-white whitespace-nowrap hover:bg-primaryhover rounded px-4 py-2 text-xs"
                  >
                    {t("Sign In")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>
      )}
    </>
  );
}
