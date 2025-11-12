'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import apiRequest from '@/utils/api';
import Loader from '@/components/Loader/Loader';
import useTranslate from '@/hooks/useTranslation';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import FloatingSettings from '@/components/common/FloatingSettings';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError(t('Email is required'));
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest(
        process.env.NEXT_PUBLIC_API_ENDPOINT_FORGOT_PASSWORD,
        'POST',
        null,
        { email }
      );

      if (response?.success) {
        toast.success(response.message);
        setEmail('');
      }
    } catch (err) {
      const msg = err?.error || t('Something went wrong');
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="dark:text-white">
        <Header />

        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">{t('Forgot password?')}</h1>
              <p className="text-sm mt-2">
                {t('Remember your password?')}{' '}
                <a href="/signin" className="text-primary hover:underline font-medium">
                  {t('Login here')}
                </a>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-1">
                  {t('Email Address')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-md text-sm text-gray-700 dark:text-white bg-transparent focus:border-primary focus:outline-none"
                  placeholder={t('Enter your email')}
                />
                {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-md font-semibold hover:opacity-90 transition"
              >
                {t('Reset password')}
              </button>
            </form>
          </div>
        </div>
        <Footer />
        <FloatingSettings />
      </div>
    </>
  );
}

ForgotPasswordPage.getLayout = (page) => page;
