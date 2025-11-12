/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ⬇️ change this:
  output: 'standalone',          // was: 'export'  ❌
  images: { unoptimized: true }, // keep if you’re not using next/image optimization
  i18n: {
    locales: ['en', 'bn'],
    defaultLocale: 'bn',
    localeDetection: true,
  },
  eslint: { ignoreDuringBuilds: true },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
