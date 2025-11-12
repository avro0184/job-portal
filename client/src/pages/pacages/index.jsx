"use client";

import React from "react";
import { useRouter } from "next/router";
import SeoHead from "@/components/Seo/SeoHead";
import useTranslate from "@/hooks/useTranslation";
import PricingSection from "@/components/home/PricingSection";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import FloatingSettings from "@/components/common/FloatingSettings";
import Carousel from "@/components/Carousel";
import AutoScrollPdf from "@/components/AutoScrollPdf";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";

export default function PackagePage() {
  const { t } = useTranslate();
  const router = useRouter();
  const path = router.asPath.split("?")[0];

  const canonicalUrl = `https://amarprosno.com${router.asPath}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Amar Prosno Packages",
    description: t(
      "Flexible packages for students, teachers, and institutions with AI-powered preparation tools."
    ),
    url: canonicalUrl,
    brand: {
      "@type": "Organization",
      name: "Amar Prosno",
    },
  };

  return (
    <>
      <SeoHead
        title={`${t("Packages")} - Amar Prosno | ${t("Smart Practice & Preparation")}`}
        description={t(
          "Choose from Free, Teacher Pro, or Institution plans to unlock personalized study tools, analytics, and preparation features."
        )}
        keywords={t(
          "packages, subscription plans, premium study, AI practice, exam preparation, learning plans"
        )}
        canonical={canonicalUrl}
        image="https://amarprosno.com/images/amp.jpg"
        jsonLd={jsonLd}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white no-scrollbar">
       {
        path === "/pacages"  && (
          <>
        <Header />
        </>
        )
       }

        {/* Pricing Plans */}
        <div className="dark:bg-gray-900 mt-10">
        <PricingSection />
        </div>

        {/* OMR Demo Section */}
        <section className="py-16 bg-gray-100 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
            {/* Left: Features */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                {t("চোখের পলকে হবে OMR Evaluation !")}
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  t("✅ রিয়েল-টাইম স্ক্যানিং ও মূল্যায়ন"),
                  t("✅ সঠিকভাবে দাগানো ও ভুল দাগানো শনাক্তকরণ"),
                  t("✅ সঠিক ও ভুল উত্তর বিশ্লেষণ"),
                  t("✅ Negative Marking (-0.25, -0.5, -1) সুবিধা"),
                  t("✅ কাস্টমাইজড OMR এ পরীক্ষা নেওয়ার সুযোগ"),
                  t("✅ স্কুল, কলেজ ও ইনস্টিটিউটের জন্য উপযোগী"),
                ].map((f, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 text-gray-800 dark:text-gray-200 flex items-start"
                  >
                    <span className="mr-2">✔</span> {f}
                  </div>
                ))}
              </ul>
              <button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow">
                {t("OMR Evaluate করুন")}
              </button>
            </div>

            {/* Right: Carousel */}
            <div className="flex justify-center">
              <Carousel />
            </div>
          </div>
        </section>

        {/* Question Demo Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
            {/* Left: Interactive Questions */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow">
              <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
                {t("প্রশ্ন সিলেক্ট করুন")}
              </h3>
              <ul className="space-y-3">
                {[
                  {
                    q: t("১. বাংলাদেশের রাজধানী কোনটি?"),
                    opts: ["চট্টগ্রাম", "ঢাকা ✅", "খুলনা", "রাজশাহী"],
                  },
                  {
                    q: t("২. সূর্য কেন আলো দেয়?"),
                    opts: [
                      "তাপ বিকিরণ",
                      "পরমাণু বিক্রিয়া ✅",
                      "নিউক্লিয়ার ফিউশন",
                      "বিদ্যুতিক তরঙ্গ",
                    ],
                  },
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="p-3 bg-white dark:bg-gray-600 rounded border border-green-500"
                  >
                    <p className="font-medium">{item.q}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      {item.opts.map((o, i) => (
                        <span
                          key={i}
                          className={`px-2 py-1 rounded ${
                            o.includes("✅")
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 dark:bg-gray-500"
                          }`}
                        >
                          {o.replace("✅", "")}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
              <button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow">
                {t("সাবমিট করুন")}
              </button>
            </div>

            {/* Right: Printable View */}
            <AutoScrollPdf />
              
          </div>
        </section>
        {
          path === "/pacages"  && (
            <>
            <Footer />
            <ScrollToTopButton />
            <FloatingSettings />
            </>
          )
        }
      </div>
    </>
  );
}

PackagePage.getLayout = (page) => page;
