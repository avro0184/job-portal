'use client';

import React from 'react';
import Link from 'next/link';
import useTranslate from '@/hooks/useTranslation';
import { Facebook, Instagram, YouTube, LinkedIn } from '@mui/icons-material';

export default function Footer() {
  const { t } = useTranslate();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 pt-10 pb-6 text-sm text-gray-700 dark:text-gray-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-left">
          {/* Logo & Description */}
          <div>
            <h2 className="text-primary font-bold text-xl mb-2">{t('Amar Prosno')}</h2>
            <p className="text-sm text-gray-600 dark:text-white">
              {t("MCQ Bank, Bookshelf, Question Generator, Exam Hosting & Evaluation — all smartly digitized.")}
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold mb-2 text-gray-800 dark:text-white">{t('Company')}</h3>
            <ul className="space-y-1">
              <li><Link href="/about" className="hover:underline">{t('About Us')}</Link></li>
              <li><Link href="/refund" className="hover:underline">{t('Refund Policy')}</Link></li>
              <li><Link href="/privacy" className="hover:underline">{t('Privacy Policy')}</Link></li>
              <li><Link href="/terms" className="hover:underline">{t('Terms & Conditions')}</Link></li>
              <li><Link href="/cancellation" className="hover:underline">{t('Cancellation Policy')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold mb-2 text-gray-800 dark:text-white">{t('Contact')}</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="tel:+8801572906168" className="hover:underline">{t('Phone')}: +88 01572906168</a></li>
              <li><a href="https://wa.me/8801572906168" target="_blank" rel="noopener noreferrer" className="hover:underline">{t('WhatsApp')}: +88 01572906168</a></li>
              <li><a href="tel:+8801572906168" className="hover:underline">{t('Support')}: +88 01572906168</a></li>
              <li><a href="mailto:info@amarprosno.com" className="hover:underline">{t('Email')}: info@amarprosno.com</a></li>
              <li>{t('Company Reg')}: C-000000</li>
              <li>{t('Trade License')}: 000000000</li>
            </ul>
          </div>

          {/* Community + App */}
          <div>
            <h3 className="font-bold mb-2 text-gray-800 dark:text-white">{t('Community')}</h3>
            <div className="flex gap-4 mb-4 text-primary">
              <a href="https://www.facebook.com/stydy.amarprosno" aria-label="Facebook" target="_blank"><Facebook /></a>
              <a href="#" aria-label="Instagram" target="_blank"><Instagram /></a>
              <a href="#" aria-label="YouTube" target="_blank"><YouTube /></a>
              <a href="#" aria-label="LinkedIn" target="_blank"><LinkedIn /></a>
            </div>
            <div>
              <img
                src="/HomeIcon/playstore.png"
                alt="Download on Google Play"
                className="w-36 rounded shadow"
              />
            </div>
          </div>
        </div>

        {/* Payment Banner */}
        <div className="my-12 text-center">
          <h4 className="font-semibold text-gray-700 dark:text-white mb-4">{t("Pay with any supported method")}</h4>
          <img
            src="/HomeIcon/payment_banner.png"
            alt="Payment Methods"
            className="max-w-full h-auto mx-auto rounded shadow-md"
          />
        </div>
      </div>

   <div className="border-t border-gray-300 dark:border-gray-600 mt-8 pt-4 text-xs text-center text-gray-500 dark:text-gray-400">
  &copy; {new Date().getFullYear()} Amar Prosno Ltd. {t("All rights reserved.")}. 
  <br />
  <Link href="/privacy-policy" className="underline hover:text-gray-700 dark:hover:text-gray-200">
    Privacy Policy
  </Link>
</div>

    </footer>
  );
}
