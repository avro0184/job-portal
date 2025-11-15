// components/Hero.jsx
import { Box, Container, Grid, Typography, Button } from '@mui/material';

export default function Hero() {
  return (
    <section className="bg-white dark:bg-gray-900 py-16 md:py-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* Left: Text */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              Find Your <span className="text-primary">Dream Job</span> Today
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Explore thousands of job listings and connect with top companies worldwide.
            </p>

            <button className="bg-primary hover:bg-primaryhover text-white font-semibold px-6 py-3 rounded-lg transition-all">
              Get Started
            </button>
          </div>

          {/* Right: Image */}
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80&auto=format&fit=crop"
              alt="Job search illustration"
              className="w-full rounded-xl shadow-lg"
              loading="lazy"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
