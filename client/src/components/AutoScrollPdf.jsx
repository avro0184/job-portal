"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "/omr/questions_page-0001.jpg",
  "/omr/questions_page-0002.jpg",
];

export default function Carousel({ autoPlay = true, interval = 3000 }) {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((index + 1) % images.length);
  const prev = () => setIndex((index - 1 + images.length) % images.length);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => next(), interval);
    return () => clearInterval(timer);
  }, [index, autoPlay, interval]);

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Image */}
      <div className="w-full flex justify-center">
        <AnimatePresence mode="wait">
          <motion.img
            key={images[index]}
            src={images[index]}
            alt={`Page ${index + 1}`}
            className="rounded-lg shadow-lg max-w-md w-full object-contain"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between w-full max-w-md mt-4">
        <button
          onClick={prev}
          className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
        >
          ◀
        </button>

        <div className="flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full ${
                i === index
                  ? "bg-primary"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
