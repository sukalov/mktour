import AuthButton from '@/components/auth/auth-button';
import { NavMenuProps } from '@/components/navigation';
import Menu from '@/components/navigation/mobile/menu';
import GlobalSearch from '@/components/navigation/search';
import { FC } from 'react';

const Mobile: FC<NavMenuProps> = ({ user }) => {
  return (
    <div className="flex">
      <GlobalSearch user={user} />
      {user && <AuthButton user={user} />}
      <Menu user={user} />
    </div>
  );
};

export default Mobile;
