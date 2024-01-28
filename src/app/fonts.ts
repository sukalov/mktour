import { Azeret_Mono, Roboto_Mono } from 'next/font/google';
import localFont from 'next/font/local';

export const turboPascal = localFont({
  src: './fonts/TurboPascalFont.ttf',
  display: 'swap',
});

export const robotoMono = Roboto_Mono({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--roboto-mono',
});

export const azeretMono = Azeret_Mono({
  subsets: ['latin'],
  display: 'swap',
  fallback: ['var(--roboto-mono)'],
});
