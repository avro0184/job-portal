import en from "@/../public/locales/en/common.json";
import bn from "@/../public/locales/bn/common.json";
import { useSelector } from "react-redux";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";

export default function useTranslate() {
  const reduxLocale = useSelector((state) => state.language.locale);
  const [locale, setLocale] = useState("bn"); // default is Bangla

  useEffect(() => {
    const cookieLocale = Cookie.get("locale") || "bn";
    setLocale(reduxLocale || cookieLocale);
  }, [reduxLocale]);

  const translations = locale === "bn" ? bn : en;

  const t = (key) => translations[key] || key;

  return { t, locale };
}
