import AuthButton from '@/components/auth/auth-button';
import { NavMenuProps } from '@/components/navbars';
import Menu from '@/components/navbars/mobile/menu-content';
import { FC } from 'react';

const Mobile: FC<NavMenuProps> = ({ user }) => {
  return (
    <div className="flex">
      {user && <AuthButton user={user} />}
      <div className="w-8">
        <Menu user={user} />
      </div>
    </div>
  );
};

export default Mobile;
