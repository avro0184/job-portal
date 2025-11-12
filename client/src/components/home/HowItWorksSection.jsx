'use client';

import React from 'react';
import { motion } from 'framer-motion';
import useTranslate from '@/hooks/useTranslation';

export default function HowItWorksSection() {
  const { t } = useTranslate();

  const steps = [
    {
      title: t('1. Choose Your Role'),
      description: t('Start as a student or teacher. Customize your experience from the first click.'),
      icon: '🎭',
    },
    {
      title: t('2. Explore Questions & Exams'),
      description: t('Students practice MCQs by class/topic. Teachers generate question sets, schedule tests, or export OMR-ready sheets.'),
      icon: '📚',
    },
    {
      title: t('3. Track Progress & Insights'),
      description: t('Get real-time analytics — accuracy, time taken, strengths & weaknesses. Prepare smarter with detailed feedback.'),
      icon: '📊',
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 text-center">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
        {t('How Amar Prosno Works')}
      </h2>

      <p className="text-base text-gray-600 dark:text-gray-300 mb-12 max-w-2xl px-2 mx-auto">
        {t("Whether you're preparing for exams or helping others prepare — here’s how it works.")}
      </p>

      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto px-6">
        {steps.map((step, index) => (
          <motion.article
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="text-4xl mb-4">{step.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {step.description}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
