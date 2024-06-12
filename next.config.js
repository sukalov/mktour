const MillionLint = require('@million/lint');
/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer');
const { withAxiom } = require('next-axiom');
const nextConfig = {
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
      ? MillionLint.next({ rsc: true })(withAxiom(nextConfig))
      : withAxiom(nextConfig);
