import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';

const Empty: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname().split('/').at(-1);
  const t = useTranslations('Empty');

  return (
    <div className="mt-8 flex w-full justify-center px-4 text-sm text-muted-foreground">
      <p>{children ? children : t(`${pathname}`)}</p>
    </div>
  );
};

export default Empty;
