import AuthButton from '@/components/auth/auth-button';
import LocaleSwitcher from '@/components/locale-switcher';
import { NavMenuProps } from '@/components/navigation';
import NavigationMenuContainer from '@/components/navigation/desktop/navigation-menu';
import ModeToggler from '@/components/navigation/mode-toggler';
import GlobalSearch from '@/components/navigation/search';
import { FC } from 'react';

const Desktop: FC<NavMenuProps> = ({ user }) => {
  return (
    <div className="flex w-full justify-end">
      <NavigationMenuContainer />
      <GlobalSearch />
      <div className="flex items-center">
        <AuthButton user={user} />
        <LocaleSwitcher />
        <ModeToggler />
      </div>
    </div>
  );
};

export default Desktop;
