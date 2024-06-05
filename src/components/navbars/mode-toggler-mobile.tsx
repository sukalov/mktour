import { cn } from '@/lib/utils';
import { MoonStarIcon, SunMoonIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

interface ModeTogglerProps {
  className?: string;
}

export default function ModeTogglerMobile({ className }: ModeTogglerProps) {
  const { setTheme, theme } = useTheme();

  return (
    <button
      className={cn(`w-full text-center text-lg`, className)}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <SunMoonIcon className="block rotate-0 scale-100 transition-all duration-300 dark:hidden dark:-rotate-90 dark:scale-0" />
      <MoonStarIcon className="rotate-290 hidden scale-0 transition-all duration-300 dark:block dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
