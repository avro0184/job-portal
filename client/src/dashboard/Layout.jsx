import React, { useEffect, useState } from "react";
import { TopBar } from "./Topbar/TopBar";
import { Sidebar } from "./sidebar/Sidebar";
import { DashboardProvider, useDashboardContext } from "./Provider";
import Loader from "@/components/Loader/Loader";
import { MobileBottomNav } from "./sidebar/SidebarItems";
import JobPortalHeader from "./Topbar/JobPortalHeader";

function LayoutBody({ children, hideBottomNav = false }) {
  const { sidebarOpen } = useDashboardContext();

  return (
    <div className="dark:bg-gray-900 h-screen overflow-hidden relative">
      <div className={`flex flex-col h-screen  pl-0 w-full`}>
        {/* <TopBar /> */}
        <JobPortalHeader />
        <main className="overflow-auto md:w-[80%] mx-auto no-scrollbar md:px-2 h-[calc(100vh-48px)]">
          {children}
        </main>
      </div>
      {!hideBottomNav && <MobileBottomNav />}
    </div>
  );
}

export function DashboardLayout({ children, hideBottomNav = false }) {
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    setAuthChecked(true);
  }, []);

  if (!authChecked) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <DashboardProvider>
      <LayoutBody hideBottomNav={hideBottomNav}>{children}</LayoutBody>
    </DashboardProvider>
  );
}
