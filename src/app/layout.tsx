import NavbarWrapper from '@/components/navbar-wrapper';
import ThemeProvider from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Provider as AtomsProvider } from 'jotai';
import { AxiomWebVitals } from 'next-axiom';
import { PropsWithChildren } from 'react';

export const metadata = {
  title: 'mktour',
  description: 'an app for organazing complex tournament brackets of all kind',
};

function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
      />
      <AxiomWebVitals />
      <body>
        <AtomsProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* @ts-expect-error Server Component */}
            <NavbarWrapper />
            <div className="px-8 pt-14"></div>
            {children}
            <Analytics />
            <SpeedInsights />
            <Toaster />
          </ThemeProvider>
        </AtomsProvider>
      </body>
    </html>
  );
}

export default RootLayout;
