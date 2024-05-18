import { getUser } from '@/lib/auth/utils';
import { ReactNode } from 'react';

export default function ClubsPageLayout({ children }: ClubsPageLayoutProps) {
    const user = getUser();
    if (!user) return children;

  return (
    <>
      <div>{children}</div>
    </>
  );
}

interface ClubsPageLayoutProps {
  children: ReactNode;
//   create: ReactNode;
}
