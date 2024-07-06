'use client';

import AuthButton from '@/components/auth/auth-button';
import { setUserLocale } from '@/components/get-user-locale';
import DesktopNavbar from '@/components/navbars/desktop-navbar';
import ModeToggler from '@/components/navbars/mode-toggler';
import Content from '@/components/navbars/nav-menu/content';
import MktourNavbar from '@/components/ui/mktour-logo-navbar';
import { User } from 'lucia';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavMenu({ user }: NavMenuProps) {
  const pathname = usePathname().split('/')[1];
  const isTournament = pathname === 'tournament';
  const locale = useLocale();
  const handleClickLocale = async () => {
    setUserLocale(locale === 'en' ? 'ru' : 'en');
  };

  return (
    <nav className="fixed z-50 flex max-h-14 w-full min-w-max flex-row items-center justify-between border-b bg-background p-4 md:pl-4">
      <div className="flex flex-grow justify-start">
        <Link href="/">
          <MktourNavbar isTournament={isTournament} />
        </Link>
      </div>
      <Content pathname={pathname} user={user} />
      <DesktopNavbar user={user} />
      <AuthButton user={user} className="hidden md:block" />
      <ModeToggler className="hidden md:block" />
      <button className="mx-2 hidden md:block" onClick={handleClickLocale}>
        {locale.toUpperCase()}
      </button>
    </nav>
  );
}

type NavMenuProps = {
  user: User | null;
  node_env?: 'development' | 'production' | 'test';
};
