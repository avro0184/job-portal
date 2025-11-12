'use client';

import React from 'react';
import { Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import useTranslate from '@/hooks/useTranslation';

export default function CTASection() {
  const { t } = useTranslate();

  return (
    <motion.div
      className="bg-gradient-to-br from-purple-100 via-green-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-black py-16 text-center flex  flex-col justify-center items-center gap-3 px-4"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
        {t('Start preparing, my question with help')}
      </h2>

      <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
        {t("Whether you're a student preparing for exams or a teacher building smart test sets — Amar Prosno has you covered.")}
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/study" passHref>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#6754e8',
              color: '#fff',
              px: 3,
              py: 1.5,
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#5842d8',
              },
            }}
          >
            {t("I'm a Student")}
          </Button>
        </Link>

        <Link href="/study" passHref>
          <Button
            variant="outlined"
            size="large"
            sx={{
              color: '#6754e8',
              borderColor: '#6754e8',
              px: 3,
              py: 1.5,
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#f3f0ff',
                borderColor: '#6754e8',
              },
            }}
          >
            {t("I'm a Teacher")}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
