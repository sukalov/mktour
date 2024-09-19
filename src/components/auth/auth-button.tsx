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
import { useRouter } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';
import { Button } from '../ui/button';
import LichessLogo from '../ui/lichess-logo';

export default function AuthButton({ user }: AuthButtonProps) {
  const router = useRouter();
  const t = useTranslations('Menu');

  const handleSignOut = async () => {
    const response = await fetch('/api/sign-out', {
      method: 'POST',
      redirect: 'manual',
    });

    if (response.status === 0) {
      return router.refresh();
    }
  };

  if (!user) {
    return (
      <>
        <Link href="/login/lichess">
          <Button className={`flex-row gap-2 p-2`} variant="ghost">
            <LichessLogo size="24" />
            {t('login')}
          </Button>
        </Link>
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="select-none gap-2 p-3">
            <User2 size={20} />
            <div className="hidden sm:block">{user.username}</div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="-translate-x-2 translate-y-1">
          {menuItems.map((item) => (
            <StyledItem
              key={item.title}
              className="w-full"
              onClick={() => router.push(item.path)}
            >
              {t(`Subs.${item.title}`)}
            </StyledItem>
          ))}
          <StyledItem onClick={handleSignOut}>{t('logout')}</StyledItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

const StyledItem: FC<
  PropsWithChildren & { className?: string; onClick?: () => void }
> = ({ children, className, onClick }) => (
  <DropdownMenuItem
    className={`text-md flex w-full justify-start ${className}`}
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
];

type MenuItems = {
  title: MessageKeys<
    IntlMessages['Menu']['Subs'],
    keyof IntlMessages['Menu']['Subs']
  >;
  path: string;
}[];

export interface AuthButtonProps {
  user?: User | null;
}
