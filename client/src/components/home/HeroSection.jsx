'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import useTranslate from '@/hooks/useTranslation';
import { MdDashboard, MdOutlineLibraryBooks, MdMenuBook, MdFlashOn } from "react-icons/md";
import { BsArchive } from "react-icons/bs";
import { FaClipboardList, FaChalkboardTeacher, FaListAlt } from "react-icons/fa";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { RiLiveLine } from "react-icons/ri";

const features = [
  { icon: '✅', title: 'MCQ Practice', description: 'Thousands of MCQs categorized by class, subject, chapter, and topic.', link: '/study/mcq-question' },
  { icon: '🧠', title: 'Concept Clarity', description: 'Get detailed explanations to reinforce understanding and learning.', link: '/study/mcq-question' },
  { icon: '🔍', title: 'Critical Thinking', description: 'Enhance reasoning skills with high-order, thought-provoking questions.', link: '/study/mcq-question' },
  { icon: '🛠️', title: 'Question Generator', description: 'Create custom sets by chapter, type, and difficulty for better preparation.', link: '/study/mcq-question' },
  { icon: '🧾', title: 'OMR & Solutions', description: 'Download printable OMR sheets, answer keys, and solution PDFs.', link: '/study/mcq-question' },
  { icon: '🌐', title: 'Online Exams', description: 'Host time-bound online tests with automated scoring and student insights.', link: '/study/mcq-question' },
  { icon: '📊', title: 'Performance Reports', description: 'Track progress, accuracy, and strength/weakness analytics over time.', link: '/study/mcq-question' },
  { icon: '🎓', title: 'For All Levels', description: 'From school and board exams to university admission and govt jobs.', link: '/study/mcq-question' },
];

// ✅ Sidebar-style data with icons
const navData = [
  { type: "item", titleKey: "Archive Questions", link: "/study/mcq-question", icon: <BsArchive size={18} />, badge: "NEW" },
  { type: "item", titleKey: "Question Bank", link: "/study/question-bank", icon: <MdOutlineLibraryBooks size={18} />, badge: "HOT" },

  { type: "header", titleKey: "Exam Section" },
  { type: "item", titleKey: "Quick Practice", link: "/study/quick-practice", icon: <MdFlashOn size={18} />, badge: "FLASH" },
  { type: "item", titleKey: "Mock Test", link: "/study/mock-test", icon: <MdDashboard size={18} />, badge: "PRO" },
  { type: "item", titleKey: "Preset Exams", link: "/study/preset-exams", icon: <FaClipboardList size={18} />, badge: "SET" },
  { type: "item", titleKey: "Selected Question", link: "/study/selected-question", icon: <AiOutlineCheckCircle size={18} />, badge: "CHECK" },
  { type: "item", titleKey: "Question List", link: "/study/generated-question", icon: <FaListAlt size={18} />, badge: "LIST" },

  { type: "header", titleKey: "Monitoring Section" },
  { type: "item", titleKey: "Live Exams", link: "/study/exam", icon: <RiLiveLine size={18} />, badge: "LIVE" },
  { type: "item", titleKey: "Question Generator", link: "/study/create-question", icon: <RiLiveLine size={18} />, badge: "AI" },
  { type: "item", titleKey: "OMR", link: "/study/omr/omr-sheet", icon: <RiLiveLine size={18} />, badge: "SCAN" },
  { type: "item", titleKey: "Reports", link: "/study/exam", icon: <RiLiveLine size={18} />, badge: "REPORT" },
  { type: "item", titleKey: "Online Exams", link: "/study/exam", icon: <RiLiveLine size={18} />, badge: "ONLINE" },

  { type: "header", titleKey: "Learning Support" },
  // later you can add more items with unique badges...
];


function DemoMCQ() {
  const { t } = useTranslate();
  const [picked, setPicked] = useState(null);
  const correct = 1;
  const options = [t('Osmosis'), t('Diffusion'), t('Active transport'), t('Endocytosis')];

  return (
    <div className="mt-12 w-full max-w-xl mx-auto p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg text-left">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">{t('Quick Demo')}</h3>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        {t('Which process moves molecules from higher to lower concentration without energy?')}
      </p>
      <div className="space-y-2">
        {options.map((opt, i) => {
          const chosen = picked === i;
          const isCorrect = i === correct;
          return (
            <button
              key={i}
              onClick={() => setPicked(i)}
              className={`w-full text-left px-4 py-2 rounded-lg border transition
                ${picked === null
                  ? 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  : chosen && isCorrect
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : chosen && !isCorrect
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                      : 'border-gray-200 dark:border-gray-700'
                }`}
            >
              <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="mt-4 text-sm">
          {picked === correct ? (
            <p className="text-green-700 dark:text-green-300">
              {t('✅ Correct! Diffusion is passive and requires no energy.')}
            </p>
          ) : (
            <p className="text-red-700 dark:text-red-300">
              {t('❌ Not quite. The correct answer is Diffusion.')}
            </p>
          )}
        </div>
      )}
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => setPicked(null)}
          className="text-xs px-3 py-1 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          {t('Reset')}
        </button>
        <Link
          href="/study/mcq-question"
          className="text-xs px-3 py-1 bg-primary text-white rounded-md hover:bg-primaryhover transition"
        >
          {t('See full demo →')}
        </Link>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const { t } = useTranslate();

  return (
    <motion.section
      className="relative z-10 py-32 px-4 text-center bg-gradient-to-br from-white via-slate-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          {t('Welcome to')}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-600">
            {" "} {t('Amar Prosno')}
          </span>
          <span>{" "} ( {t('Class 6 - BCS')} )</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
          {t('Amar Prosno is a platform designed to help students, teachers, and institutions succeed through powerful tools and smart analytics.')}
        </p>

        {/* 🔥 Explore Sections with icons */}
        <div className="mb-24">
          <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white mb-8">{t('Explore Sections')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-5xl mx-auto justify-center">
            {navData
              .filter((item) => item.type === "item")
              .map((item, i) => (
                <Link
                  key={i}
                  href={item.link}
                  className="relative flex items-center gap-3 px-4 py-3 rounded-lg 
          bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
          shadow-sm hover:shadow-md hover:border-primary transition"
                >
                  {/* Icon */}
                  <div className="text-primary text-xl">{item.icon}</div>

                  {/* Title */}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {t(item.titleKey)}
                  </span>

                  {/* Badge (top-right corner) */}
                  {item.badge && (
                    <span
                      className={`absolute -top-2 -right-2 text-[10px] px-1.5 py-0.5 
              rounded-full font-bold shadow
              ${item.badge === "LIVE" ? "bg-rose-600 text-white animate-pulse" : ""}
              ${item.badge === "NEW" ? "bg-green-600 text-white" : ""}
              ${item.badge === "HOT" ? "bg-orange-500 text-white animate-bounce" : ""}
              ${item.badge === "PRO" ? "bg-indigo-600 text-white" : ""}
              ${item.badge === "FLASH" ? "bg-yellow-500 text-black" : ""}
              ${item.badge === "SET" ? "bg-gray-600 text-white" : ""}
              ${item.badge === "CHECK" ? "bg-lime-600 text-white" : ""}
              ${item.badge === "LIST" ? "bg-cyan-600 text-white" : ""}
              ${item.badge === "AI" ? "bg-blue-600 text-white" : ""}
              ${item.badge === "SCAN" ? "bg-teal-600 text-white" : ""}
              ${item.badge === "REPORT" ? "bg-purple-600 text-white" : ""}
              ${item.badge === "ONLINE" ? "bg-pink-600 text-white" : ""}
            `}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
          </div>

        </div>

        {/* <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-16 max-w-3xl mx-auto">
          {t('Your personalized platform to master every subject through smart practice and deep analytics.')}
        </p> */}

        <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white mb-8">{t('Features Sections')}</h2>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto text-left"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
        >
          {features.map((item, index) => (
            <motion.div
              key={index}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.03 }}
            >
              <Link
                href={item.link}
                className="block group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-md hover:border-primary hover:shadow-xl transition duration-300 h-full"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 text-primary text-xl w-12 h-12 flex items-center justify-center rounded-full group-hover:bg-primary group-hover:text-white transition">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t(item.title)}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t(item.description)}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Inline Demo */}
        <DemoMCQ />
      </div>
    </motion.section>
  );
}
