'use client';

import { useAuth } from '@/components/hooks/query-hooks/use-user';
import Desktop from '@/components/navigation/desktop';
import Mobile from '@/components/navigation/mobile';
import { MediaQueryContext } from '@/components/providers/media-query-context';
import MktourNavbar from '@/components/ui-custom/mktour-logo-navbar';
import { User } from 'lucia';
import { FC, useContext, useEffect, useState } from 'react';

const Navigation: FC<NavMenuProps> = ({ user: initialUser }) => {
  const { isTablet } = useContext(MediaQueryContext);
  const [mounted, setMounted] = useState(false);
  const { data: user } = useAuth(initialUser);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  const showMobile = mounted ? isTablet : true;
  const currentUser = mounted && user ? user : null;

  return (
    <nav className="bg-background p-mk md:p-mk-2 fixed z-50 flex h-14 w-full items-center justify-between border-b">
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
