/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  env: {
    NEXT_PUBLIC_SST_API_URL: process.env.NEXT_PUBLIC_SST_API_URL,
  },
};

module.exports = nextConfig;
