import ReactComponentName from 'react-scan/react-component-name/webpack';
import MillionLint from '@million/lint';
import withPlugins from 'next-compose-plugins';
import createNextIntlPlugin from 'next-intl/plugin';
import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const bundleAnalyzer = withBundleAnalyzer({
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

import nextPWA from 'next-pwa';
const withPWA = nextPWA({
  dest: 'public',
  mode: process.env.VERCEL_ENV,
  disable: process.env.VERCEL_ENV === 'development',
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  register: true,
});

export default process.env.OPT === 'true'
  ? MillionLint.next({ rsc: true })(nextConfig)
  : withPlugins([[bundleAnalyzer], [withNextIntl], [withPWA]], nextConfig);
