/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    COOLIFY_API_URL: process.env.COOLIFY_API_URL || 'http://localhost:8000',
    COOLIFY_API_TOKEN: process.env.COOLIFY_API_TOKEN || '',
    JWT_SECRET: process.env.JWT_SECRET || 'kumo-secret-change-me-in-production-2026',
    NEXT_PUBLIC_APP_NAME: 'Kumo',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://app.getkumo.org',
  },
};

module.exports = nextConfig;
