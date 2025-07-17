'use client';

import Desktop from '@/components/navigation/desktop';
import Mobile from '@/components/navigation/mobile';
import { MediaQueryContext } from '@/components/providers/media-query-context';
import MktourNavbar from '@/components/ui/mktour-logo-navbar';
import { User } from 'lucia';
import { FC, useContext, useEffect, useState } from 'react';

const Navigation: FC<NavMenuProps> = ({ user }) => {
  const { isTablet } = useContext(MediaQueryContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showMobile = mounted ? isTablet : true;
  const currentUser = mounted ? user : null;

  return (
    <nav className="bg-background p-mk-2 sm:py-mk fixed z-50 flex h-14 w-full items-center justify-between border-b">
      <MktourNavbar />
      {showMobile ? (
        <Mobile user={currentUser} />
      ) : (
        <Desktop user={currentUser} />
      )}
    </nav>
  );
};

export type NavMenuProps = {
  user: User | null;
};

export default Navigation;
