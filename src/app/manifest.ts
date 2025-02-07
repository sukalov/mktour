import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'mktour PWA',
    short_name: 'mktourPWA',
    start_url: '/',
    display: 'standalone',
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
    screenshots: [
      {
        src: '/icon.png',
        form_factor: 'narrow',
        sizes: '320x320',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        form_factor: 'wide',
        sizes: '320x320',
        type: 'image/png',
      },
    ],
  };
}
