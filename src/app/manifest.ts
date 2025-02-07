import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'mktour PWA',
    short_name: 'mktourPWA',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon.png',
        sizes: '98x98',
        type: 'image/png',
      },
    ],
    shortcuts: [
      {
        name: 'make tournament',
        url: '/tournaments/create',
        icons: [{ src: '/icon.png', sizes: '98x98', type: 'image/png' }],
      },
    ],
  };
}
