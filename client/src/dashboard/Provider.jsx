import React, { useState, useEffect, useCallback, useContext } from "react";
import { useRouter } from "next/router";

const Context = React.createContext(null);

export function DashboardProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  // detect screen size on mount
 useEffect(() => {
  const mediaQuery = window.matchMedia("(min-width: 768px)");
  
  // mobile (<768px) হলে false, desktop হলে true
  if (mediaQuery.matches) {
    setSidebarOpen(true);
  } else {
    setSidebarOpen(false);
  }

  const handleResize = (e) => {
    setSidebarOpen(e.matches);
  };

  mediaQuery.addEventListener("change", handleResize);
  return () => mediaQuery.removeEventListener("change", handleResize);
}, []);


  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(
    () => setSidebarOpen((prev) => !prev),
    []
  );

  // optional: prevent body scroll
  // useEffect(() => {
  //   document.documentElement.style.overflow = "hidden";
  // }, []);

  return (
    <Context.Provider
      value={{ sidebarOpen, setSidebarOpen, openSidebar, closeSidebar, toggleSidebar }}
    >
      {children}
    </Context.Provider>
  );
}

export function useDashboardContext() {
  return useContext(Context);
}
