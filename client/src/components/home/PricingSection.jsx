'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useTranslate from '@/hooks/useTranslation';

export default function PricingSection() {
  const { t } = useTranslate();
  const [showPopup, setShowPopup] = useState(false);

  const handleCTAClick = (cta) => {
    // Only show popup for non-free plans
    if (cta === t('Get Pro Access') || cta === t('Contact Sales')) {
      setShowPopup(true);
    } else {
      // redirect or navigate for free plan
      window.location.href = '/dashboard';
    }
  };

  const packages = [
    {
      title: t('Student Access'),
      price: t('Free'),
      description: t('Ideal for students who want to practice, revise, and track their performance.'),
      features: [
        t('📝 Unlimited MCQ practice'),
        t('📚 Chapter-wise & timed tests'),
        t('📈 Progress reports'),
        t('📱 Mobile-friendly access'),
      ],
      cta: t('Start Learning'),
      featured: false,
    },
    {
      title: t('Teacher Pro'),
      price: t('৳499/mo'),
      description: t('Perfect for teachers who want to manage students and create custom exams.'),
      features: [
        t('🛠️ Generate question sets'),
        t('🧾 Print OMR sheets & solutions'),
        t('⚙️ Auto-evaluated exams'),
        t('📊 Student-wise analytics'),
      ],
      cta: t('Get Pro Access'),
      featured: true,
    },
    {
      title: t('Institution Plan'),
      price: t('Custom'),
      description: t('For coaching centers, schools, or institutions managing large student batches.'),
      features: [
        t('👥 Multi-teacher access'),
        t('🏫 Institution branding'),
        t('🌐 Custom domains & dashboards'),
        t('🎧 Priority support'),
      ],
      cta: t('Contact Sales'),
      featured: false,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black text-center">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
        {t('Choose Your Plan')}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-12 max-w-2xl px-2 mx-auto text-base">
        {t('Flexible options for students, educators, and institutions — no hidden fees.')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {packages.map((pkg, index) => (
          <motion.div
            key={index}
            className={`rounded-2xl p-6 border-2 transition duration-300 shadow-md ${pkg.featured
                ? 'border-primary bg-white dark:bg-gray-800 hover:shadow-2xl scale-105'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg'
              }`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            {pkg.featured && (
              <div className="mb-2 inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                {t('Most Popular')}
              </div>
            )}

            <h3 className="text-primary font-bold text-lg mb-1">{pkg.title}</h3>
            <p className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-3">{pkg.price}</p>
            <p className="text-sm text-primary dark:text-gray-300 mb-5">{pkg.description}</p>

            <ul className="text-left text-sm space-y-2 mb-6 text-gray-700 dark:text-gray-300">
              {pkg.features.map((feat, i) => (
                <li key={i}>{feat}</li>
              ))}
            </ul>

            <button
              onClick={() => handleCTAClick(pkg.cta)}
              className="w-full bg-primary hover:bg-primaryhover text-white font-semibold py-2 px-4 rounded-lg transition shadow-md hover:shadow-lg"
            >
              {pkg.cta}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-purple-200 dark:border-gray-700">
            <div className="inline-block mb-3 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-red-500 text-white text-sm font-semibold shadow-md">
              ⚙️ {t('Payment Help')}
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              {t('The payment process is under development.')}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {t("Please contact us via WhatsApp or phone to get access.")}
            </p>
            <div className="mt-4 space-y-2 text-sm font-medium">
              📞 <a href="tel:01572906168" className="text-blue-600 hover:underline">{t('01572906168')}</a><br />
              💬 <a
                href="https://wa.me/8801572906168"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 underline"
              >
                {t('Contact on Whatsapp')}
              </a>
            </div>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-5 inline-block bg-gradient-to-r from-primary to-primaryhover text-white font-semibold px-4 py-2 rounded-full shadow hover:scale-105 transition transform"
            >
              ✖ {t('Close')}
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
