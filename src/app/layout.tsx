import NavWrapper from '@/components/navigation/nav-wrapper';
import MediaQueryProvider from '@/components/providers/media-query-provider';
import ReactQueryProvider from '@/components/providers/react-query-provider';
import ThemeProvider from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { AxiomWebVitals } from 'next-axiom';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { ViewTransitions } from 'next-view-transitions';
import { PropsWithChildren } from 'react';

async function RootLayout({ children }: PropsWithChildren) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <AxiomWebVitals />
      <body className="small-scrollbar">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MediaQueryProvider>
            <NextIntlClientProvider messages={messages}>
              <ReactQueryProvider>
                <NavWrapper />
                <ViewTransitions>
                  <div className="pt-14">{children}</div>
                </ViewTransitions>
                <Analytics />
                <SpeedInsights />
                <Toaster richColors />
              </ReactQueryProvider>
            </NextIntlClientProvider>
          </MediaQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: 'mktour',
  description: 'an app for managing complex tournaments of all kind',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default RootLayout;
