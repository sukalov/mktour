/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')
const { withAxiom } = require('next-axiom');

const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = process.env.ANALYZE === 'true' ? withBundleAnalyzer(nextConfig) : withAxiom(nextConfig);
