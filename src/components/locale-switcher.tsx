import { LoadingSpinner } from '@/app/loading';
import { setUserLocale } from '@/components/get-user-locale';
import { Button } from '@/components/ui/button';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';

const LocaleSwitcher = () => {
  const locale = useLocale();
  const [pending, startTransition] = useTransition();
  const handleClickLocale = () => {
    startTransition(() => {
      setUserLocale(locale === 'en' ? 'ru' : 'en');
    });
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleClickLocale}>
      {pending ? (
        <LoadingSpinner />
      ) : (
        <span>{locale === 'en' ? 'en' : 'рус'}</span>
      )}
    </Button>
  );
};

export default LocaleSwitcher;
