/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/context/**/*.{js,ts,jsx,tsx}',
    './src/hooks/**/*.{js,ts,jsx,tsx}',
    './src/dashboard/**/*.{js,ts,jsx,tsx}',
    './src/Redux/**/*.{js,ts,jsx,tsx}',
    './src/utils/**/*.{js,ts,jsx,tsx}',
    './src/theme/**/*.{js,ts,jsx,tsx}',
    './src/styles/**/*.css',
  ],

  theme: {
    extend: {
      colors: {
        primary: "#6754e8",
        primaryhover: "#715fe8",
        secondary: "#64748b",
        tertiary: "#94a3b8",
        quaternary: "#cbd5e1",
        quinary: "#e2e8f0",
        senary: "#f1f5f9",
        septenary: "#f8fafc",
        dark: "#0f172a",
      },
      fontFamily: {
        sans: ['Noto Sans', 'sans-serif'],
        bangla: ['Tiro Bangla', 'serif'],
      },
    },
  },

  plugins: [
    require("tailwind-scrollbar-hide"),
    require("@tailwindcss/typography"),
  ],
};
