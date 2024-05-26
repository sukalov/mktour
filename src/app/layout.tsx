import ThemeProvider from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { AxiomWebVitals } from 'next-axiom';
import { PropsWithChildren } from 'react';

import IntlProvider from '@/components/intl-provider';
import NavbarWrapper from '@/components/navbars/navbar-wrapper';
import '@/styles/globals.css';
import { ViewTransitions } from 'next-view-transitions';

export const metadata = {
  title: 'mktour',
  description: 'an app for managing complex tournaments of all kind',
};

function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      <AxiomWebVitals />
      <body className="touch-pan-x touch-pan-y">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <IntlProvider>
            <NavbarWrapper />
            <ViewTransitions>
              <div className="pt-14">{children}</div>
            </ViewTransitions>
            <Analytics />
            <SpeedInsights />
            <Toaster />
          </IntlProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export default RootLayout;
