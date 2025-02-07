import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Next.js PWA',
    short_name: 'NextPWA',
    description: 'A Progressive Web App built with Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: 'screenshot.webp',
        sizes: '1280x720',
        type: 'image/webp',
        form_factor: 'wide',
      },
      {
        src: 'screenshot.webp',
        sizes: '1280x720',
        type: 'image/webp',
        form_factor: 'narrow',
      },
    ],
  };
}
