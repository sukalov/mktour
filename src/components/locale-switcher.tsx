import { setUserLocale } from '@/components/get-user-locale';
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

  useEffect(() => {
    console.log('effect triggered');
    setPending(false);
  }, [locale]);

  if (pending) return <Loader2 className="w-full animate-spin text-center max-w-[20px]" />;
  return <button className='max-w-[20px]' onClick={handleClickLocale}>{locale.toUpperCase()}</button>;
};

export default LocaleSwitcher;
