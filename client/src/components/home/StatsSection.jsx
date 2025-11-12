'use client';

import React from 'react';
import { Typography } from '@mui/material';
import { motion } from 'framer-motion';
import useTranslate from '@/hooks/useTranslation';


export default function StatsSection() {
  const { t } = useTranslate();

  const stats = [
    { value: '12,000+', label: t('Registered Students') },
    { value: '1.5M+', label: t('MCQs Practiced') },
    { value: '2,500+', label: t('Teachers Onboarded') },
    { value: '1,200+', label: t('Exams Conducted') },
  ];

  return (
    <motion.section
      className="py-20 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          mb: 6,
          color: 'text.primary',
          textAlign: 'center',
        }}
        className='dark:text-white'
      >
        {t('Trusted by Thousands of Learners & Educators')}
      </Typography>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
        {stats.map((item, index) => (
          <motion.div
          
            key={index}
            className="bg-white dark:border-primary dark:border dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition-transform hover:scale-105 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
          
            <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700 }}>
              {item.value}
            </Typography>
            <Typography className='dark:text-white' sx={{ color: 'text.secondary', fontSize: '0.875rem', mt: 1 }}>
              {item.label}
            </Typography>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
