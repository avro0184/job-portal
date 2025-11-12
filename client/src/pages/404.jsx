'use client';

import React from 'react';
import Link from 'next/link';
import { Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import useTranslate from '@/hooks/useTranslation';

export default function NotFoundPage() {
  const { t } = useTranslate();

  return (
    <motion.div
      className="min-h-[90vh] flex flex-col gap-3 w-full flex flex-col justify-center items-center bg-gradient-to-br from-white via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black px-4 text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Typography
        variant="h1"
        className="text-[6rem] font-extrabold text-primary drop-shadow-md mb-2"
      >
        {t('404')}
      </Typography>

      <Typography variant="h5" className="font-bold text-gray-800 dark:text-white mb-2">
        {t('Page Not Found')}
      </Typography>

      <Typography className="text-gray-600 dark:text-gray-400  mb-6">
        {t("Sorry, the page you’re looking for doesn't exist or has been moved.")}
      </Typography>

      <Link href="/dashboard" passHref>
        <Button
          variant="contained"
          size="large"
          className="bg-primary text-white px-8 py-2 rounded shadow hover:shadow-lg transition"
        >
          {t('Back to Home')}
        </Button>
      </Link>
    </motion.div>
  );
}
