import AuthButton from '@/components/auth/auth-button';
import LocaleSwitcher from '@/components/locale-switcher';
import { NavMenuProps } from '@/components/navbars';
import NavigationMenuContainer from '@/components/navbars/desktop/navigation-menu';
import ModeToggler from '@/components/navbars/mode-toggler';
import { FC } from 'react';

const Desktop: FC<NavMenuProps> = ({ user }) => {
  return (
    <div className="flex w-full justify-end">
      <NavigationMenuContainer />
      <div className="flex items-center">
        <AuthButton user={user} />
        <LocaleSwitcher />
        <ModeToggler />
      </div>
    </div>
  );
};

export default Desktop;
