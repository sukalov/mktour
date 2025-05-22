'use client';

import { useTranslations } from 'next-intl';
import { FC, PropsWithChildren } from 'react';

const Empty: FC<
  PropsWithChildren & {
    className?: string;
    messageId?: keyof IntlMessages['Empty'];
  }
> = ({ children, className, messageId }) => {
  const t = useTranslations('Empty');

  return (
    <div
      className={`text-muted-foreground flex w-full justify-center p-4 text-sm ${className}`}
    >
      <p>{children ? children : t(messageId ?? 'no data')}</p>
    </div>
  );
};

export default Empty;
