import NavbarWrapper from '@/components/navbars/navbar-wrapper';
import IntlProvider from '@/components/providers/intl-provider';
import MediaQueryProvider from '@/components/providers/media-query-provider';
import ReactQueryProvider from '@/components/providers/react-query-provider';
import ThemeProvider from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { AxiomWebVitals } from 'next-axiom';
import { ViewTransitions } from 'next-view-transitions';
import { PropsWithChildren } from 'react';

function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <AxiomWebVitals />
      <body className="small-scrollbar">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MediaQueryProvider>
            <IntlProvider>
              <ReactQueryProvider>
                <NavbarWrapper />
                <ViewTransitions>
                  <div className="pt-14">{children}</div>
                </ViewTransitions>
                <Analytics />
                <SpeedInsights />
                <Toaster richColors />
              </ReactQueryProvider>
            </IntlProvider>
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
