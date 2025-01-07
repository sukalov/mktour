const MillionLint = require('@million/lint');
/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer');
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
module.exports =
  process.env.ANALYZE === 'true'
    ? withBundleAnalyzer(nextConfig)
    : process.env.OPT === 'true'
      ? MillionLint.next({ rsc: true })(nextConfig)
      : nextConfig;

const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/components/i18n.ts');

module.exports = withNextIntl(nextConfig);
