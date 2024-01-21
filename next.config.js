/** @type {import('next').NextConfig} */
import { withAxiom } from 'next-axiom';
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = withAxiom(nextConfig);
