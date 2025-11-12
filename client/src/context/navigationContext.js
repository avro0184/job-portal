"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/router";

const NavContext = createContext(null);

export function NavProvider({ children }) {
  const router = useRouter();
  const [stack, setStack] = useState([]);

  const push = (url) => {
    setStack((prev) => [...prev, url]);
    router.push(url);
  };

  const back = () => {
    setStack((prev) => {
      if (prev.length > 1) {
        const newStack = prev.slice(0, -1);
        const prevUrl = newStack[newStack.length - 1];
        router.push(prevUrl);
        return newStack;
      }
      // fallback if no history in stack
      router.back();
      return prev;
    });
  };

  return (
    <NavContext.Provider value={{ stack, push, back }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used inside NavProvider");
  return ctx;
}
