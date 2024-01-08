import * as React from 'react';
import { SunMoonIcon, MoonStarIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ModeTogglerProps {
  className?: string;
}

export default function ModeTogglerMobile({ className }: ModeTogglerProps) {
  const { setTheme, theme } = useTheme();

  return (
    <button
      className={cn(`text-lg`, className)}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <SunMoonIcon className=" block rotate-0 scale-100 transition-all dark:hidden dark:-rotate-90 dark:scale-0" />
      <MoonStarIcon className=" rotate-290 hidden scale-0 transition-all dark:block dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
