import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from 'lucia';
import { User2 } from 'lucide-react';
import { MessageKeys, useTranslations } from 'next-intl';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';
import LichessLogo from '../ui-custom/lichess-logo';
import { Button } from '../ui/button';

export default function AuthButton({ user }: AuthButtonProps) {
  const t = useTranslations('Menu');

  const handleSignOut = async () => {
    const response = await fetch('/api/auth/sign-out', {
      method: 'POST',
      redirect: 'manual',
    });

    if (response.status === 0) {
      redirect('/sign-in');
    }
  };

  if (!user) {
    return (
      <>
        <Button className={`flex-row gap-2 p-2`} variant="ghost" asChild>
          <Link href="/login/lichess" prefetch={false}>
            <LichessLogo />
            {t('Profile.login')}
          </Link>
        </Button>
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 p-3 select-none">
            <User2 size={20} />
            <div className="hidden sm:block">{user.username}</div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="-translate-x-2 translate-y-1">
          {menuItems.map((item) => (
            <Link href={item.path} key={item.title}>
              <StyledItem className="w-full">
                {t(`Subs.${item.title}`)}
              </StyledItem>
            </Link>
          ))}
          <StyledItem onClick={handleSignOut}>{t('Profile.logout')}</StyledItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

const StyledItem: FC<
  PropsWithChildren & { className?: string; onClick?: () => void }
> = ({ children, className, onClick }) => (
  <DropdownMenuItem
    className={`flex w-full justify-start text-base ${className}`}
    onClick={onClick}
  >
    {children}
  </DropdownMenuItem>
);

const menuItems: MenuItems = [
  {
    title: 'profile',
    path: '/user',
  },
  {
    title: 'edit profile',
    path: '/user/edit',
  },
  {
    title: 'inbox',
    path: '/inbox',
  },
];

type MenuItems = {
  title: MessageKeys<
    IntlMessages['Menu']['Subs'],
    keyof IntlMessages['Menu']['Subs']
  >;
  path: string;
}[];

interface AuthButtonProps {
  user?: User | null;
}
