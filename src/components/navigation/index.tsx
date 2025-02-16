'use client';

import Desktop from '@/components/navigation/desktop';
import Mobile from '@/components/navigation/mobile';
import { MediaQueryContext } from '@/components/providers/media-query-context';
import MktourNavbar from '@/components/ui/mktour-logo-navbar';
import { User } from 'lucia';
import { FC, useContext } from 'react';

const Navigation: FC<NavMenuProps> = ({ user }) => {
  const { isTablet } = useContext(MediaQueryContext);
  return (
    <nav className="bg-background fixed z-50 flex h-14 w-full items-center justify-between border-b p-4">
      <MktourNavbar />
      {isTablet ? <Mobile user={user} /> : <Desktop user={user} />}
    </nav>
  );
};

export type NavMenuProps = {
  user: User | null;
};

export default Navigation;
