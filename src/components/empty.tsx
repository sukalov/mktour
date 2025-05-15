'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';

const Empty: FC<PropsWithChildren & { className?: string }> = ({
  children,
  className,
}) => {
  const pathname = usePathname().split('/').at(-1) as Pathname;
  const t = useTranslations('Empty');

  return (
    <div
      className={`text-muted-foreground flex w-full justify-center p-4 text-sm ${className}`}
    >
      <p>{children ? children : t(`${pathname}`)}</p>
    </div>
  );
};

type Pathname = 'players' | 'inbox' | 'tournaments' | 'dashboard' | 'user';

export default Empty;
