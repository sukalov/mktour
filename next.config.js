const MillionLint = require('@million/lint');
const withPlugins = require('next-compose-plugins');
const createNextIntlPlugin = require('next-intl/plugin');
/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
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

module.exports = process.env.OPT === 'true'
  ? MillionLint.next({ rsc: true })(nextConfig)
  : withPlugins([[withBundleAnalyzer], [withNextIntl]], nextConfig);
