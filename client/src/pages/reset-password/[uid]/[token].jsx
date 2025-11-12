'use client';

import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import apiRequest from '@/utils/api';
import Loader from '@/components/Loader/Loader';
import useTranslate from '@/hooks/useTranslation';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import FloatingSettings from '@/components/common/FloatingSettings';

export default function ResetPassword() {
  const router = useRouter();
  const { uid, token } = router.query;
  const { t } = useTranslate();

  const [isLoading, setIsLoading] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [formdata, setFormdata] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({ ...formdata, [name]: value });
    setFormErrors({});
  };

  const validate = () => {
    const errors = {};
    if (!formdata.newPassword) errors.newPassword = t('New Password is required');
    else if (formdata.newPassword.length < 8)
      errors.newPassword = t('Password must be at least 8 characters');

    if (!formdata.confirmPassword) errors.confirmPassword = t('Confirm Password is required');
    else if (formdata.newPassword !== formdata.confirmPassword)
      errors.confirmPassword = t('Passwords do not match');

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await apiRequest(
        process.env.NEXT_PUBLIC_API_ENDPOINT_RESET_PASSWORD,
        'POST',
        null,
        {
          uid,
          token,
          newPassword: formdata.newPassword,
          confirmPassword: formdata.confirmPassword,
        }
      );

      if (response.success) {
        toast.success(t(response.message));
        router.push('/signin');
      }
    } catch (error) {
      toast.error(error?.error || t('Something went wrong'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className='dark:text-white'>
        <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">{t('Reset Your Password')}</h1>
            <p className="text-sm mt-2">
              {t('Remember your password?')}{' '}
              <a href="/signin" className="text-primary hover:underline font-medium">
                {t('Login here')}
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div className="relative">
              <label htmlFor="newPassword" className="text-sm font-medium mb-1 block">
                {t('New Password')}
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type={newPasswordVisible ? 'text' : 'password'}
                value={formdata.newPassword}
                onChange={handleChange}
                className="w-full py-2 px-4 border-2 border-gray-200 rounded-md bg-transparent text-sm text-gray-800 dark:text-white focus:border-primary focus:outline-none"
              />
              <div
                className="absolute right-3 top-9 cursor-pointer"
                onClick={() => setNewPasswordVisible(!newPasswordVisible)}
              >
                {newPasswordVisible ? <FaEye /> : <FaEyeSlash />}
              </div>
              {formErrors.newPassword && (
                <p className="text-xs text-red-600 mt-1">{formErrors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="text-sm font-medium mb-1 block">
                {t('Confirm Password')}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={confirmPasswordVisible ? 'text' : 'password'}
                value={formdata.confirmPassword}
                onChange={handleChange}
                className="w-full py-2 px-4 border-2 border-gray-200 rounded-md bg-transparent text-sm text-gray-800 dark:text-white focus:border-primary focus:outline-none"
              />
              <div
                className="absolute right-3 top-9 cursor-pointer"
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              >
                {confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
              </div>
              {formErrors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">{formErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primaryhover text-white font-semibold py-3 rounded-md transition"
            >
              {t('Reset Password')}
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

ResetPassword.getLayout = (page) => page;
