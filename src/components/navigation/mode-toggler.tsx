import { Button } from '@/components/ui/button';
import { MoonStarIcon, SunMoonIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';

export default function ModeToggler() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  if (!mounted) {
    return (
      <Button variant="ghost" className="px-2">
        <span className="invisible">•</span>
      </Button>
    );
  }

  return (
    <Button variant="ghost" className="px-2" onClick={toggleTheme}>
      <SunMoonIcon className="block scale-100 rotate-0 transition-all dark:hidden dark:scale-0 dark:-rotate-90" />
      <MoonStarIcon className="hidden scale-0 rotate-290 transition-all dark:block dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
