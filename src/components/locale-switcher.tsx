import { setUserLocale } from '@/components/get-user-locale';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';

const LocaleSwitcher = () => {
  const locale = useLocale();
  const [pending, setPending] = useState(false);
  const handleClickLocale = () => {
    setPending(true);
    setUserLocale(locale === 'en' ? 'ru' : 'en');
  };

  // FIXME this fires multiple times for some reason
  useEffect(() => {
    setPending(false);
  }, [locale]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClickLocale}
    >
      {pending ? (
        <Loader2 className="animate-spin text-center font-thin" />
      ) : (
        <span>{locale}</span>
      )}
    </Button>
  );
};

export default LocaleSwitcher;
