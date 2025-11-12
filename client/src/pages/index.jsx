import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FaTimes } from "react-icons/fa";

import Header from "@/components/home/Header";
import HeroSection from "@/components/home/HeroSection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import Footer from "@/components/home/Footer";
import CTASection from "@/components/home/CTASection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import FAQSection from "@/components/home/FAQSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import PackagePage from "./pacages"; // typo? should be "packages"
import FloatingSettings from "@/components/common/FloatingSettings";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import useTranslate from "@/hooks/useTranslation";
import Loader from "@/components/Loader/Loader";
import apiRequest from "@/utils/api";
import FloatingContact from "@/components/common/FloatingContact";
import Chatbot from "@/components/common/Chatbot";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { t } = useTranslate();

  // Restore scroll state
  useEffect(() => {
    document.documentElement.style.overflow = "auto";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    if (document.readyState === "complete") {
      setLoading(false);
    } else {
      window.addEventListener("load", handleComplete);
    }

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
      window.removeEventListener("load", handleComplete);
    };
  }, [router]);



  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>{t("Job Portal")} - </title>
        <meta name="description" content="Job Portal" />
      </Head>

      <div className="overflow-y-scroll bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white no-scrollbar">
        <Header />
        {/* existing code  */}
        <Footer />
        <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-4 z-50">
          <ScrollToTopButton />
          <FloatingSettings />
          <FloatingContact />
          {/* <Chatbot /> */}
        </div>
      </div>
    </>
  );
}

HomePage.getLayout = (page) => page;
