/** @type {import('next').NextConfig} */
const ReactComponentName = require('react-scan/react-component-name/webpack');
const MillionLint = require('@million/lint');
const withPlugins = require('next-compose-plugins');
const createNextIntlPlugin = require('next-intl/plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const nextConfig = {
  experimental: {
    reactCompiler: true,
    ppr: 'incremental',
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  webpack: (config) => {
    config.plugins.push(ReactComponentName({}));
    return config;
  },
};
const withNextIntl = createNextIntlPlugin('./src/components/i18n.ts');
const withPWA = require('next-pwa')({
  dest: 'public',
  mode: process.env.VERCEL_ENV,
  disable: process.env.VERCEL_ENV === 'development',
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  register: true,
});

module.exports =
  process.env.OPT === 'true'
    ? MillionLint.next({ rsc: true })(nextConfig)
    : withPlugins(
        [[withBundleAnalyzer], [withNextIntl], [withPWA]],
        nextConfig,
      );
