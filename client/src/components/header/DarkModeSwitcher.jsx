"use client";
import { useThemeContext } from "@/context/ThemeProvider";

export default function DarkModeSwitcher() {
  const { isDark, setIsDark } = useThemeContext();

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <label
      className={`relative block h-8 w-16 rounded-full transition-all duration-300 ease-in-out ${
        isDark ? "bg-primary" : "bg-gray-300"
      }`}
    >
      <input
        type="checkbox"
        onChange={toggleTheme}
        checked={isDark}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <span
        className={`absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out rounded-full flex items-center justify-center w-7 h-7 bg-white shadow-md ${
          isDark ? "translate-x-8" : "translate-x-0"
        }`}
      >
        {isDark ? "🌙" : "☀️"}
      </span>
    </label>
  );
}
