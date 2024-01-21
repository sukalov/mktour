/** @type {import('next').NextConfig} */
const { withAxiom } = require('next-axiom');
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
      serverComponentsExternalPackages: ["oslo"]
    }
};

module.exports = withAxiom(nextConfig);
