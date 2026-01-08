import AuthButton from '@/components/auth/auth-button';
import Menu from '@/components/navigation/mobile/menu';
import GlobalSearch from '@/components/navigation/search';

const Mobile = () => {
  return (
    <div className="flex">
      <GlobalSearch />
      <AuthButton />
      <Menu />
    </div>
  );
};

export default Mobile;
