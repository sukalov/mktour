'use client';

import Desktop from '@/components/navigation/desktop';
import Mobile from '@/components/navigation/mobile';
import MktourNavbar from '@/components/ui/mktour-logo-navbar';
import { User } from 'lucia';
import { FC } from 'react';

const Navigation: FC<NavMenuProps> = ({ user }) => {
  return (
    <nav className="fixed z-50 flex h-14 w-full items-center justify-between border-b p-4">
      <MktourNavbar />
      <div className="md:hidden">
        <Mobile user={user} />
      </div>
      <div className="hidden md:block">
        <Desktop user={user} />
      </div>
    </nav>
  );
};

export type NavMenuProps = {
  user: User | null;
};

export default Navigation;
