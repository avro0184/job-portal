import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import useTranslate from "@/hooks/useTranslation";
import { useDashboardContext } from "../Provider";
import { getToken } from "@/utils/auth";

import { MdCreate, MdDashboard, MdFlashOn, MdMenuBook, MdNotificationAdd, MdOutlineLibraryBooks, MdOutlineMenu } from "react-icons/md";
import { FaClipboardList, FaChalkboardTeacher, FaListAlt, FaUser } from "react-icons/fa";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { BsArchive } from "react-icons/bs";
import { RiLiveLine } from "react-icons/ri";
import { useEffect, useState } from "react";

const iconMap = {
  Dashboard: <MdDashboard size={14} />,
  "Archive Questions": <BsArchive size={14} />,
  "Question Bank": <MdOutlineLibraryBooks size={14} />,
  "Selected Question": <AiOutlineCheckCircle size={14} />,
  "Question List": <FaListAlt size={14} />,
  "Quick Practice": <MdFlashOn size={14} />,
  "Mock Test": <MdDashboard size={14} />,
  "Preset Exams": <FaClipboardList size={14} />,
  "Live Exams": <RiLiveLine size={14} />,
  "Mentorship Program": <FaChalkboardTeacher size={14} />,
  "Book List": <MdMenuBook size={14} />,
  "Profile": <FaUser size={14} />,
  "More": <MdOutlineMenu size={14} />,
  "Create Question": <MdCreate size={14} />,
  "Notifications": <MdNotificationAdd size={14} />,
};
export function SidebarItems() {
  const { t } = useTranslate();
  const router = useRouter();
  const { sidebarOpen, closeSidebar } = useDashboardContext(); // ⬅️ use closeSidebar
  const token = getToken();
  const userInfo = useSelector((state) => state.userInfo.userInfo);


const data = [
  { type: "item", titleKey: "Dashboard", link: "/study" },
  { type: "item", titleKey: "Archive Questions", link: "/study/mcq-question" },
  { type: "item", titleKey: "Question Bank", link: "/study/question-bank" },

  { type: "header", titleKey: "Exam Section" },
  { type: "item", titleKey: "Quick Practice", link: "/study/quick-practice" },
  { type: "item", titleKey: "Mock Test", link: "/study/mock-test" },
  { type: "item", titleKey: "Preset Exams", link: "/study/preset-exams" },

  { type: "header", titleKey: "Monitoring Section" },
  { type: "item", titleKey: "Courses", link: "/study/course" },
  { type: "item", titleKey: "Live Exams", link: "/study/exam" },

  { type: "header", titleKey: "Learning Support" },
  { type: "item", titleKey: "Mentorship Program", link: "/study/mentorship-program" },

  { type: "header", titleKey: "Book Section" },
  { type: "item", titleKey: "Book List", link: "/study/book-list" },

  { type: "header", titleKey: "Profile Section" },
  { type: "item", titleKey: "Profile", link: "/study/profile" },
];

// ✅ Add Exam Creation Section if user has remaining question credits
if (userInfo?.remaining_questions > 0) {
  data.splice(7, 0,  // optional: insert before "Monitoring Section"
    { type: "header", titleKey: "Exam Creation Section" },
    { type: "item", titleKey: "Selected Question", link: "/study/selected-question" },
    { type: "item", titleKey: "Question List", link: "/study/generated-question" },
    { type: "item", titleKey: "Create Question", link: "/study/create-question" },
    { type: "item", titleKey: "Amar Prosno Ai", link: "/study/amarprosno-ai-question" },
    { type: "item", titleKey: "OMR", link: "/study/omr" }
  );
}

// ✅ Add admin-only item
if (userInfo?.is_superuser) {
  data.push({ type: "item", titleKey: "Notifications", link: "/study/notifications" });
}



  // Close sidebar on mobile (below md breakpoint) after clicking a nav item
  const handleItemClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      closeSidebar?.();
    }
  };

  return (
    <ul className="space-y-1">
      {data.map((item, index) => {
        if (item.type === "header") {
          return (
            <li
              key={`header-${index}`}
              className="text-xs font-semibold text-gray-500 uppercase whitespace-nowrap mt-4 mb-2 ms-3"
            >
              {t(item.titleKey)}
            </li>
          );
        }

        const isHome = item.link === "/study";
        const isActive = isHome
          ? router.pathname === item.link
          : router.pathname === item.link || router.pathname.startsWith(item.link + "/");

        return (
          <li key={item.titleKey}>
            <Link
              href={item.link}
              onClick={handleItemClick} // ⬅️ close sidebar on mobile
              className={`relative flex items-center transition px-2 py-2 rounded-lg mx-2
                ${isActive ? "bg-primary text-white" : "hover:bg-primaryhover dark:hover:bg-primaryhover"}
              `}
            >
              <div
                className={`text-xs p-1 rounded-lg shadow border transition duration-200 flex items-center justify-center
                ${
                  isActive
                    ? "bg-white text-primary border-primary"
                    : "bg-white text-gray-700 dark:bg-gray-800 dark:text-white border-gray-200 dark:border-gray-600"
                }`}
              >
                {iconMap[item.titleKey] || <MdDashboard size={14} />}
              </div>

              <span
                className={`ml-3 text-base whitespace-nowrap transition-all duration-200
                  ${isActive ? "font-semibold text-white" : "text-gray-900 dark:text-white"}
                  ${sidebarOpen ? "opacity-100 visible" : "opacity-0 hidden"}
                `}
              >
                {t(item.titleKey)}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}



export function MobileBottomNav({ autoHideFor = 0, forceHidden = false }) {
  const { t } = useTranslate();
  const router = useRouter();
  const { closeSidebar, toggleSidebar } = useDashboardContext();

  const [hidden, setHidden] = useState(false);

  // 🔹 Auto hide once (if set and not forced hidden)
  useEffect(() => {
    if (autoHideFor > 0 && !forceHidden) {
      setHidden(true);
      const timer = setTimeout(() => setHidden(false), autoHideFor);
      return () => clearTimeout(timer);
    }
  }, [autoHideFor, forceHidden]);

  // 🔹 Completely hide on exam playing page
  if (forceHidden || router.pathname.startsWith("/study/exam/active") || router.pathname.startsWith("/study/mentorship-program")) {
    return null;
  }

  const bottomItems = [
    { type: "link", titleKey: "Dashboard", link: "/study" },
    { type: "link", titleKey: "Archive Questions", link: "/study/mcq-question" },
    { type: "link", titleKey: "Question Bank", link: "/study/question-bank" },
    { type: "link", titleKey: "Live Exams", link: "/study/exam" },
    { type: "more", titleKey: "More" },
  ];

 const handleItemClick = (item) => {
  if (item.type === "more") {
    toggleSidebar?.();   
  } else if (item.type === "link") {
    closeSidebar?.();  
    router.push(item.link);
  }
};


  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transform transition-transform duration-500 rounded-t-3xl
        ${hidden ? "translate-y-full" : "translate-y-0"}
        bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-inner`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex justify-around items-center h-16">
        {bottomItems.map((item) => {
          const isHome = item.link === "/study";
          const isActive =
            item.type === "link" &&
            (isHome
              ? router.pathname === item.link
              : router.pathname === item.link ||
                router.pathname.startsWith(item.link + "/"));

          return (
            <li key={item.titleKey}>
              {item.type === "more" ? (
                <button
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className="flex flex-col items-center text-xs text-gray-500 dark:text-gray-300"
                >
                  {iconMap.More}
                  <span>{t(item.titleKey)}</span>
                </button>
              ) : (
                <Link
                  href={item.link}
                  onClick={() => handleItemClick(item)}
                  className={`flex flex-col items-center text-xs ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-gray-500 dark:text-gray-300"
                  }`}
                >
                  {iconMap[item.titleKey] || <MdDashboard size={18} />}
                  <span>{t(item.titleKey)}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
