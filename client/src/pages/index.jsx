// src/pages/index.jsx
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import Hero from "@/components/home/Hero";
import FeaturedJobsSection from "@/components/home/FeaturedJobsSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import CompaniesSection from "@/components/home/CompaniesSection";
import FloatingActions from "@/components/home/FloatingActions";
import Header from "@/components/home/Header";
import JobFilters from "@/components/home/JobFilters";
import CareerAdviceSection from "@/components/home/CareerAdviceSection";
import FeaturedCompaniesCarousel from "@/components/home/FeaturedCompaniesCarousel";
import PopularTags from "@/components/home/PopularTags";
import BlogSection from "@/components/home/BlogSection";  
import Footer from "@/components/home/Footer";
import StatsSection from "@/components/home/StatsSection";
import FloatingSettings from "@/components/common/FloatingSettings";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import useTranslate from "@/hooks/useTranslation";
import Loader from "@/components/Loader/Loader";
import FloatingContact from "@/components/common/FloatingContact";
// import Chatbot from "@/components/common/Chatbot";

const featuredJobs = [
  {
    title: "Software Engineer",
    company: "Tech Solutions",
    tagLeft: "Full-Time",
    tagRight: "Full-Time",
    salary: "$80,000 - 100,000",
  },
  {
    title: "Marketing Manager",
    company: "Creative Agency",
    tagLeft: "Location",
    tagRight: "Salary",
    salary: "$80,000 - 100,000",
  },
  {
    title: "Data Analyst",
    company: "Data Insights",
    tagLeft: "Full-Time",
    tagRight: "Location",
    salary: "$80,000 - 100,000",
  },
  {
    title: "Product Designer",
    company: "Design Studio",
    tagLeft: "Salary",
    tagRight: "",
    salary: "$80,000 - 100,000",
  },
];

const categories = [
  "Software Development",
  "Marketing",
  "Data Science",
  "Design",
  "Accounting",
  "Human Resources",
  "Sales",
  "Customer Support",
];

const companies = [
  "Company A",
  "Company B",
  "Company C",
  "Company D",
  "Company E",
  "Company F",
];

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

        <Hero />
          <StatsSection />
        <section className="mx-auto max-w-6xl px-4 pb-16 lg:px-0">
  {/* Row: Popular tags (left) + Featured jobs (middle) + Blog (right) */}
  <div className="mt-10 grid gap-8 lg:grid-cols-4">
    {/* LEFT: Popular Searches */}
     <div className="lg:col-span-1">
      <JobFilters onApply={(filters) => console.log("FILTERS", filters)} />
      <PopularTags />
    </div>

    {/* MIDDLE: Featured Jobs (single column) */}
    <div className="lg:col-span-2">
      <FeaturedJobsSection jobs={featuredJobs} singleColumn={true} />
    </div>

    {/* RIGHT: Blog sidebar – limited to this row only */}
    <div className="lg:col-span-1">
      <BlogSection />
    </div>
  </div>

  {/* BELOW: everything goes full-width single column */}
  <div className="mt-12 space-y-10">
    <CategoriesSection categories={categories} />

    {/* Optional: carousel here */}
    <FeaturedCompaniesCarousel />

    <CompaniesSection companies={companies} />
  </div>
</section>
<CareerAdviceSection />
        

        

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
