import NavbarWrapper from '@/components/navbar-wrapper';
import ThemeProvider from '@/components/theme-provider';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { PropsWithChildren } from 'react';
import { azeretMono, robotoMono } from './fonts';
import '@/styles/globals.css';
import { AxiomWebVitals } from 'next-axiom';

export const metadata = {
  title: 'mktour',
  description: 'an app for organazing complex tournament brackets of all kind',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
      />
      <AxiomWebVitals />
      <body className={`${azeretMono.className} ${robotoMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* @ts-expect-error Server Component */}
          <NavbarWrapper />
          <div className="px-8 pt-16"></div>
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
