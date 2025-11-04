import withBundleAnalyzer from '@next/bundle-analyzer';
import withPlugins from 'next-compose-plugins';
import createNextIntlPlugin from 'next-intl/plugin';
import ReactComponentName from 'react-scan/react-component-name/webpack';

/** @type {import('next').NextConfig} */
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  experimental: {
    useCache: true,
    cacheComponents: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
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

export default withPlugins(
  [[bundleAnalyzer], [withNextIntl], [withPWA], [ReactComponentName]],
  nextConfig,
);
