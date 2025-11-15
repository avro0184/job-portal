import css from "../style.module.css";
import { SidebarItems } from "./SidebarItems";
import { SidebarHeader } from "./SidebarHeader";
import { useDashboardContext } from "../Provider";
import { FaTimes } from "react-icons/fa";

export function Sidebar(props) {
  const { sidebarOpen, setSidebarOpen } = useDashboardContext();

  const openSidebarClass = `
    absolute duration-500 ease-in transition-all
    w-full md:w-60
  `;

  const closedSidebarClass = `
    duration-500 ease-out transition-all
    hidden lg:block lg:w-20
  `;

  return (
    <aside
      className={`
        h-screen z-40 ms-2 mt-2 mb-2 text-white top-0
        ${props.mobileOrientation === "start" ? "left-0" : "left-0 lg:left-0"}
        ${sidebarOpen ? openSidebarClass : closedSidebarClass}
        lg:absolute dark:bg-gray-900 bg-gray-100 border border-primary px-1 rounded-xl shadow-xl
      `}
    >
      <div className="h-full flex flex-col relative">
        {/* Mobile close button */}
        {sidebarOpen && (
          <button
            className="absolute md:hidden top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-2 border border-primary z-50"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        )}

        {/* Sidebar header stays fixed */}

        {/* ✅ Scrollable items */}
        <div className={`flex-1 overflow-y-auto no-scrollbar ${css.scrollbar} pb-40`}>
          {/* <SidebarItems /> */}
        </div>
      </div>
    </aside>
  );
}
