import React from "react";
import Image from "next/image"; // if using Next.js, or use <img> otherwise
import useTranslate from "@/hooks/useTranslation";

export default function Loader() {
  const { t } = useTranslate();
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center 
                bg-black/40 backdrop-blur-sm pointer-events-auto">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-gray-300 border-t-primary animate-spin"></div>
        <div className="absolute inset-2 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 overflow-hidden">
        Job
        </div>
      </div>
      <h5 className="mt-4 text-4xl font-bold text-primary">{t("Job Portal")}</h5>
    </div>

  );
}
