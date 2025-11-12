'use client';

import React from 'react';
import { motion } from 'framer-motion';
import useTranslate from '@/hooks/useTranslation';

export default function WhyChooseSection() {
  const { t } = useTranslate();

  const features = [
    t('Huge database of curated MCQs across subjects and classes'),
    t('Self-practice mode with detailed solutions and answer explanations'),
    t('Teachers can manage question sets, assign exams, and print OMR-ready sheets'),
    t('Student dashboard to track progress, accuracy, and time efficiency'),
    t('Real-time analytics for performance evaluation'),
    t('Printable model tests with answer keys and explanations'),
    t('Secure online exam hosting with time limits and auto-evaluation'),
    t('Topic-wise feedback to improve conceptual understanding'),
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900 text-center">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900 dark:text-white">
        {t('Why Choose')} <span className="text-primary">{t('Amar Prosno')}?</span>
      </h2>

      <p className="text-base text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto px-2">
        {t('Amar Prosno is designed to help students, teachers, and institutions succeed through powerful tools and smart analytics.')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto text-left px-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            viewport={{ once: true }}
          >
            <span className="text-primary text-xl mt-1">✅</span>
            <p className="text-gray-800 dark:text-gray-200 text-sm md:text-base">{feature}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
