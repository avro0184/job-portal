'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Paper, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LanguageSwitcher from '@/components/header/LanguageChangeSwitcher';
import DarkModeSwitcher from '@/components/header/DarkModeSwitcher';
import { IoMdSettings } from "react-icons/io";
import useTranslate from '@/hooks/useTranslation';
import { getToken } from '@/utils/auth';

export default function FloatingSettings() {
  const [showPanel, setShowPanel] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t } = useTranslate();
  const wrapperRef = useRef(null);

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
  }, []);

  if (isLoggedIn) return null;

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Floating Settings Toggle Button */}
      <Tooltip title={t('Preferences')} arrow>
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="relative p-2 rounded-full bg-primary text-white text-sm shadow-lg"
        >
          <IoMdSettings size={20} />
        </button>
      </Tooltip>

      {/* Floating Panel */}
      {showPanel && (
        <Paper
          elevation={6}
          className="absolute bottom-14 right-0 p-4 rounded-xl shadow-xl bg-white dark:bg-gray-800 transition-all duration-300 w-56"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-gray-800 dark:text-white">{t('Preferences')}</span>
            <IconButton
              size="small"
              onClick={() => setShowPanel(false)}
              className="text-gray-600 dark:text-gray-300"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">{t('Dark Mode')}</span>
              <DarkModeSwitcher />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">{t('Language')}</span>
              <LanguageSwitcher />
            </div>
          </div>
        </Paper>
      )}
    </div>
  );
}
