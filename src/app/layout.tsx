import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export const metadata = {
  title: 'mktour',
  description: 'an app for organazing complex tournament brackets of all kind',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
