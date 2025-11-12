import dynamic from "next/dynamic";
import React, { useRef, useMemo } from "react";
import { useThemeContext } from "@/context/ThemeProvider"; // ✅ named import

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const Editor = ({ placeholder, content, setContent }) => {
  const editor = useRef(null);
  const { isDark } = useThemeContext();

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Start typing...",
      theme: isDark ? "dark" : "default",
      style: {
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#e5e7eb" : "#111827",
        minHeight: "200px",
        borderRadius: "0.5rem",
        padding: "0.75rem",
      },
    }),
    [placeholder, isDark]
  );

  return (
    <JoditEditor
      ref={editor}
      value={content}
      config={config}
      onBlur={(newContent) => setContent(newContent)}
    />
  );
};

export default Editor;
