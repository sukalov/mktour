/** @type {import('next').NextConfig} */
const { withAxiom } = require('next-axiom');
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = withAxiom(nextConfig);
