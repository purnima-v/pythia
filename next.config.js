// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   webpack: (config) => {
//     config.externals.push('pino-pretty', 'lokijs', 'encoding');
//     return config;
//   },
//   i18n: {
//     locales: ['en-US', 'zh-CN'],
//     defaultLocale: 'en-US',
//   },
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

module.exports = nextConfig;
