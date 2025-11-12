'use client';

import React, { useState } from 'react';
import { IoMdContact, IoMdClose } from "react-icons/io";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";

export default function FloatingSocialMenu() {
  const [open, setOpen] = useState(false);

  const socialLinks = [
    { name: "Instagram", icon: <FaInstagram size={20} />, color: "bg-pink-500", url: "https://instagram.com" },
    { name: "LinkedIn", icon: <FaLinkedin size={20} />, color: "bg-blue-700", url: "https://linkedin.com" },
    { name: "Youtube", icon: <FaYoutube size={20} />, color: "bg-red-600", url: "https://www.youtube.com/@amar-prosno" },
    { name: "Facebook", icon: <FaFacebook size={20} />, color: "bg-blue-600", url: "https://www.facebook.com/stydy.amarprosno" },
  ];

  return (
    <div className="relative flex items-center">
      {/* Social Icons */}
      <div className="relative flex items-center">
        {socialLinks.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`absolute flex items-center justify-center p-2 rounded-full text-white shadow-lg hover:scale-110 ${item.color}
              transition-all duration-500 ease-in-out`}
            style={{
              right: open ? `${i * 50}px` : "0px", // adjust gap
              opacity: open ? 1 : 0,
              pointerEvents: open ? "auto" : "none",
              transitionDelay: `${i * 100}ms`,
              zIndex: 10 - i,
            }}
          >
            {item.icon}
          </a>
        ))}
      </div>

      {/* Main Button (Contact / Close) */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center p-2.5 rounded-full bg-purple-600 text-white shadow-xl hover:bg-purple-700 transition z-20"
      >
        {open ? <IoMdClose size={20} /> : <IoMdContact size={20} />}
      </button>
    </div>
  );
}
