import AuthButton from '@/components/auth/auth-button';
import LocaleSwitcher from '@/components/locale-switcher';
import NavigationMenuContainer from '@/components/navigation/desktop/navigation-menu';
import ModeToggler from '@/components/navigation/mode-toggler';
import GlobalSearch from '@/components/navigation/search';
import { FC } from 'react';

const Desktop: FC = () => {
  return (
    <div className="flex w-full items-center justify-end align-middle">
      <NavigationMenuContainer />
      <GlobalSearch />
      <div className="flex items-center">
        <AuthButton />
        <LocaleSwitcher />
        <ModeToggler />
      </div>
    </div>
  );
};

export default Desktop;
