// src/pages/index.jsx
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import Footer from "@/components/home/Footer";
import useTranslate from "@/hooks/useTranslation";
import Loader from "@/components/Loader/Loader";
import JobPortalHeader from "@/dashboard/Topbar/JobPortalHeader";
import Hero from "@/components/jobHome/Hero";
import StatsSection from "@/components/jobHome/StatsSection";
import JobFilters from "@/components/jobHome/JobFilters";
import PopularTags from "@/components/jobHome/PopularTags";
import FeaturedJobsSection from "@/components/jobHome/FeaturedJobsSection";
import BlogSection from "@/components/jobHome/BlogSection";
import CategoriesSection from "@/components/jobHome/CategoriesSection";
import FeaturedCompaniesCarousel from "@/components/jobHome/FeaturedCompaniesCarousel";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import FloatingSettings from "@/components/common/FloatingSettings";
import FloatingActions from "@/components/jobHome/FloatingActions";
import CareerAdviceSection from "@/components/jobHome/CareerAdviceSection";
import apiRequest from "@/utils/api";
import Chatbot from "@/components/common/Chatbot";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [jobSummery, setJobSummery] = useState([]);

  const router = useRouter();
  const { t } = useTranslate();

  // -----------------------------
  // Scroll restore
  // -----------------------------
  useEffect(() => {
    document.documentElement.style.overflow = "auto";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  // -----------------------------
  // Page route loader
  // -----------------------------
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  // -----------------------------
  // Fetch homepage summary
  // -----------------------------
  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);

      try {
        const response = await apiRequest("/jobs/summery/", "GET", null);
        
        if (response.success) {
          setJobSummery(response.data);
        }
      } catch (err) {
        console.error("Error fetching summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  // -----------------------------
  // Show loading screen
  // -----------------------------
  if (loading) {
    return <Loader />;
  }

  // -----------------------------
  // MAIN PAGE CONTENT
  // -----------------------------
  return (
    <>
      <Head>
        <title>{t("Job Portal")} - </title>
        <meta name="description" content="Job Portal" />
      </Head>

      <div className="overflow-y-scroll bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white no-scrollbar">
        <JobPortalHeader />

        <Hero />

            
            <StatsSection jobSummery={jobSummery} />
        <section className="mx-auto max-w-6xl px-4 pb-16 lg:px-0">
          {/* Row: Filters + Featured Jobs + Blog */}
          <div className="mt-10 grid gap-8 lg:grid-cols-4">
            {/* LEFT */}
            <div className="lg:col-span-1">
              <JobFilters onApply={(filters) => console.log("FILTERS", filters)} />
              <PopularTags />
            </div>

            {/* MIDDLE */}
            <div className="lg:col-span-2">
              <FeaturedJobsSection
                jobs={jobSummery.recent_jobs || []}
                singleColumn={true}
              />
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-1">
              <BlogSection />
            </div>
          </div>

          {/* BELOW: full width sections */}
          <div className="mt-12 space-y-10">
            <CategoriesSection categories={jobSummery.skill_categories || []} />

            {/* Optional: Featured Companies */}
            {jobSummery?.top_company_by_job_posts?.length > 0 && (
              <FeaturedCompaniesCarousel
                companies={jobSummery.top_company_by_job_posts}
              />
            )}
          </div>
        </section>
        

        <CareerAdviceSection />

        <Footer />

        {/* Floating buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-4 z-50">
          <ScrollToTopButton />
          <FloatingSettings />
          <Chatbot />
        </div>
      </div>
    </>
  );
}

HomePage.getLayout = (page) => page;
