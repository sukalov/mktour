/** @type {import('next').NextConfig} */
const { withAxiom } = require('next-axiom');
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    serverMinification: false,
},
};

module.exports = withAxiom(nextConfig);
