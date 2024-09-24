import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';

const Empty: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname().split('/').at(-1) as Pathname;
  const t = useTranslations('Empty');

  return (
    <div className="flex w-full justify-center px-4 text-sm text-muted-foreground">
      <p>{children ? children : t(`${pathname}`)}</p>
    </div>
  );
};

type Pathname = 'players' | 'inbox' | 'tournaments' | 'dashboard' | 'user';

export default Empty;
