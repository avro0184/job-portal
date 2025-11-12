'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import useTranslate from '@/hooks/useTranslation';

const testimonials = [
  {
    name: 'Ayesha Rahman',
    role: 'HSC Student',
    quote:
      'Amar Prosno helped me organize my study routine. Practicing chapter-wise MCQs with instant feedback improved my confidence dramatically.',
  },
  {
    name: 'Mr. Hasan Ali',
    role: 'Biology Teacher',
    quote:
      'Managing tests was time-consuming — now I create and auto-check MCQs with just a few clicks.',
  },
  {
    name: 'Rakib Ahmed',
    role: 'Admission Candidate',
    quote:
      'Finally a platform where I can revise smarter and track my progress in real time.',
  },
  {
    name: 'Shamima Akter',
    role: 'SSC Student',
    quote:
      'The live reports helped me target my weak chapters and improve faster.',

  },
  {
    name: 'Sabbir Hossain',
    role: 'BCS Aspirant',
    quote:
      'Practicing MCQs every day with Amar Prosno became my go-to preparation method.',
  },
  {
    name: 'Mehnaz Chowdhury',
    role: 'Math Teacher',
    quote:
      'I rely on Amar Prosno for everything — exams, analytics, and student insights.',
  },
  {
    name: 'Tanjina Sultana',
    role: 'Class 8 Student',
    quote:
      'I love how easy it is to find chapter-wise questions. It makes my daily practice so much more focused and fun.',

  },
  {
    name: 'Mahbubur Rahman',
    role: 'College Lecturer',
    quote:
      'The platform has transformed how I prepare and deliver assessments. OMR generation and solution export are just brilliant.',
  },
  {
    name: 'Nazia Haque',
    role: 'Medical Admission Candidate',
    quote:
      'The MCQ sets here feel like actual admission tests. The timer feature really helps me simulate the real exam environment.',
  },
  {
    name: 'Tanvir Alam',
    role: 'Job Seeker (Grade 9)',
    quote:
      'Amar Prosno gave me access to the kind of questions that appear in real job exams. Very accurate and updated.',
  },
  {
    name: 'Farzana Kabir',
    role: 'Science Teacher',
    quote:
      'My students have improved significantly since I started assigning practice sets using this platform.',

  },
  {
    name: 'Zahidul Islam',
    role: 'SSC Examinee',
    quote:
      'The instant answers and explanation system helped me fix my mistakes quickly. Highly recommended for exam prep!',

  },
];

export default function TestimonialSlider() {
  const scrollRef = useRef(null);
  const { t } = useTranslate();

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      current.scrollBy({
        left: direction === 'left' ? -320 : 320,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-4">
          {t('What Our Users Say')}
        </h2>

        <p className="text-base text-center text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
          {t('Trusted by thousands of students and teachers across Bangladesh.')}
        </p>

        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full p-2 shadow hover:bg-primary hover:text-white transition"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full p-2 shadow hover:bg-primary hover:text-white transition"
          >
            <ChevronRight />
          </button>

          <motion.div
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 scroll-smooth px-2 no-scrollbar"
          >
            {testimonials.map((test, index) => (
              <motion.div
                key={index}
                className="min-w-[300px] max-w-[320px] border bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  {test.avatar ? (
                    <img
                      src={test.avatar}
                      alt={test.name}
                      className="w-12 h-12 rounded-full border-2 border-primary object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full border-2 border-primary bg-gray-200 text-gray-800 flex items-center justify-center text-lg font-bold">
                      {test.name.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h4 className="text-gray-900 dark:text-white font-semibold text-base">
                      {test.name}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-300 text-sm">{test.role}</p>
                  </div>
                </div>
                <p className="text-sm italic leading-relaxed text-gray-700 dark:text-gray-300">
                  {t(test.quote)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
