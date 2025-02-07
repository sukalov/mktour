/** @type {import('next').NextConfig} */
const MillionLint = require('@million/lint');
const withPlugins = require('next-compose-plugins');
const createNextIntlPlugin = require('next-intl/plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};
const withNextIntl = createNextIntlPlugin('./src/components/i18n.ts');
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: false,
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  mode: 'production',
});

module.exports =
  process.env.OPT === 'true'
    ? MillionLint.next({ rsc: true })(nextConfig)
    : withPlugins(
        [[withBundleAnalyzer], [withNextIntl], [withPWA]],
        nextConfig,
      );
