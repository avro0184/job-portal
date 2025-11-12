'use client';

import React from 'react';
import { motion } from 'framer-motion';
import useTranslate from '@/hooks/useTranslation';
import CountUp from 'react-countup';

const liveStats = [
  { label: 'Students Online', value: 842 },
  { label: 'Questions Practiced Today', value: 15620 },
  { label: 'Live Exams Running', value: 12 },
  { label: 'Generated Sets', value: 540 },
];

export default function HeroSectionDemo() {
  const { t } = useTranslate();

  return (
    <motion.section
      className="relative z-10 py-24 px-4 text-center bg-gradient-to-br from-white via-slate-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          {t('Welcome to')}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-600">
            {t('Amar Prosno')}
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
          {t('Smart practice, live exams, analytics, and tools — all in one platform.')}
        </p>

        {/* ✅ Live Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
          {liveStats.map((stat, i) => (
            <motion.div
              key={i}
              className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-primary">
                <CountUp end={stat.value} duration={2.5} separator="," />
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{t(stat.label)}</p>
            </motion.div>
          ))}
        </div>

        {/* ✅ Live Service Updates */}
        <motion.div
          className="bg-primary/10 border border-primary text-primary rounded-lg py-3 px-6 max-w-xl mx-auto mb-12 animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
        >
          🕒 {t("Upcoming Exam: SSC Math Model Test starts in 2 hours")}
        </motion.div>

        {/* ✅ Call To Action */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primaryhover transition">
            {t("Start Practicing")}
          </button>
          <button className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            {t("View Live Exams")}
          </button>
        </div>
      </div>
    </motion.section>
  );
}
