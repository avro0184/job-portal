import { useSelector, useDispatch } from "react-redux";
import { setLanguage } from "@/Redux/Language/languageSlice";
import { useEffect, useState } from "react";

const LanguageSwitcher = () => {
  const dispatch = useDispatch();
  const { locale } = useSelector((state) => state.language);
  const [hasMounted, setHasMounted] = useState(false);

  const toggleLanguage = () => {
    dispatch(setLanguage(locale === "en" ? "bn" : "en"));
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null; // Don't render until client
  }

  return (
    <label
      className={`relative block h-8 w-16 rounded-full transition-all duration-300 ease-in-out ${
        locale === "bn" ? "bg-primary" : "bg-gray-300"
      }`}
    >
      <input
        type="checkbox"
        onChange={toggleLanguage}
        checked={locale === "bn"}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
      />
      <span
        className={`absolute top-1/2 text-gray-900 text-center transform -translate-y-1/2 flex items-center justify-center w-7 h-7 bg-white shadow-md rounded-full text-xs font-semibold transition-all duration-300 ease-in-out ${
          locale === "bn" ? "translate-x-9" : "translate-x-0"
        }`}
      >
        {locale === "bn" ? "বাং" : "EN"}
      </span>
    </label>
  );
};

export default LanguageSwitcher;
