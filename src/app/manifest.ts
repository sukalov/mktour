import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'mktour',
    short_name: 'mktour',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/apple-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'make tournament',
        url: '/tournaments/create',
        icons: [
          {
            src: '/apple-icon.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    ],
    screenshots: [
      {
        src: '/apple-icon.png',
        form_factor: 'narrow',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        form_factor: 'wide',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
