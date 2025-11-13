'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, YouTube, LinkedIn } from '@mui/icons-material';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 pt-10 pb-6 text-sm text-gray-700 dark:text-gray-300">

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-left">

          {/* Logo & Description */}
          <div>
            <h2 className="text-primary font-bold text-xl mb-3">JobPortal</h2>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Find jobs, hire talent, manage your career and explore verified companies — 
              all in one smart platform.
            </p>
          </div>

          {/* Job Seekers */}
          <div>
            <h3 className="font-bold mb-2 text-gray-800 dark:text-white">Job Seekers</h3>
            <ul className="space-y-1">
              <li><Link href="/jobs" className="hover:underline">Browse Jobs</Link></li>
              <li><Link href="/profile" className="hover:underline">My Profile</Link></li>
              <li><Link href="/skills" className="hover:underline">Skill Assessment</Link></li>
              <li><Link href="/resume" className="hover:underline">Resume Builder</Link></li>
              <li><Link href="/help" className="hover:underline">Help Center</Link></li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h3 className="font-bold mb-2 text-gray-800 dark:text-white">Employers</h3>
            <ul className="space-y-1">
              <li><Link href="/employer/post-job" className="hover:underline">Post a Job</Link></li>
              <li><Link href="/employer/companies" className="hover:underline">Company Profiles</Link></li>
              <li><Link href="/employer/candidates" className="hover:underline">Find Candidates</Link></li>
              <li><Link href="/pricing" className="hover:underline">Subscription Plans</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact Sales</Link></li>
            </ul>
          </div>

          {/* Community + App */}
          <div>
            <h3 className="font-bold mb-2 text-gray-800 dark:text-white">Connect</h3>

            <div className="flex gap-4 mb-4 text-primary">
              <a href="#" aria-label="Facebook" target="_blank"><Facebook /></a>
              <a href="#" aria-label="Instagram" target="_blank"><Instagram /></a>
              <a href="#" aria-label="YouTube" target="_blank"><YouTube /></a>
              <a href="#" aria-label="LinkedIn" target="_blank"><LinkedIn /></a>
            </div>

            <div>
              <img
                src="/HomeIcon/playstore.png"
                alt="Get the App"
                className="w-36 rounded shadow"
              />
            </div>
          </div>

        </div>

        {/* Divider */}
        
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-gray-300 dark:border-gray-600 mt-8 pt-4 text-xs text-center text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} JobPortal Inc. All rights reserved.  
        <br />
        <Link href="/privacy-policy" className="underline hover:text-gray-700 dark:hover:text-gray-200">
          Privacy Policy
        </Link>
        {" • "}
        <Link href="/terms" className="underline hover:text-gray-700 dark:hover:text-gray-200">
          Terms & Conditions
        </Link>
      </div>

    </footer>
  );
}
