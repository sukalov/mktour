import { Button } from '@/components/ui/button';
import { MoonStarIcon, SunMoonIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ModeToggler() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      className="px-2"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <SunMoonIcon className="block rotate-0 scale-100 transition-all dark:hidden dark:-rotate-90 dark:scale-0" />
      <MoonStarIcon className="rotate-290 hidden scale-0 transition-all dark:block dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
