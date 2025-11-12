'use client';

import React, { useEffect, useState } from 'react';
import { KeyboardArrowUp } from '@mui/icons-material';
import { getToken } from '@/utils/auth';

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const token = getToken();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`relative bg-primary hover:bg-primaryhover text-white p-2 rounded-full shadow-lg text-sm`}
      aria-label="Scroll to top"
    >
      <KeyboardArrowUp fontSize="medium" />
    </button>
  );
}
