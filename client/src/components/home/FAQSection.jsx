'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useTranslate from '@/hooks/useTranslation';
import { FaQuestion } from "react-icons/fa";


export default function FAQSection() {
  const { t } = useTranslate();

  const faqs = [
    {
      question: t('Is Amar Prosno free to use?'),
      answer: t('Yes, Amar Prosno online platform is a completely free platform for general students to practice. Educational institutions can take support from Amar Prosno for their use.'),
    },
    {
      question: t('Can I generate my own question sets?'),
      answer: t('Yes! Teachers can filter by class, subject, chapter, difficulty, and more to generate custom sets.'),
    },
    {
      question: t('How do online exams work?'),
      answer: t('Teachers create the exam, share the link, and students take it online with automated scoring and analytics.'),
    },
    {
      question: t('Can I track my progress over time?'),
      answer: t('Yes, both students and teachers can view detailed performance reports for every test taken.'),
    },
    {
      question: t('Is Amar Prosno suitable for BCS and Job exams?'),
      answer: t('Absolutely! We support all grades from school to government recruitment exams including BCS, Bank, and more.'),
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black px-4">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-4">
        {t('Frequently Asked Questions')}
      </h2>

      <p className="text-base text-center text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
        {t('Have questions about using Amar Prosno? We’ve got answers!')}
      </p>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow hover:shadow-md transition"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full text-left px-6 py-4 flex items-start gap-2 font-medium text-gray-800 dark:text-white"
            >
              <span className="text-primary text-xl mt-[2px]"><FaQuestion /></span>
              <span className="flex-1">{faq.question}</span>
              <span className="text-primary transform transition-transform duration-600" style={{ transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0)' }}>
                ▼
              </span>
            </button>

            {openIndex === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="px-6 pb-4 text-sm text-gray-700 dark:text-gray-300"
              >
                {faq.answer}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
