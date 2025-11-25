'use client';

import { useSignOutMutation } from '@/components/hooks/mutation-hooks/use-sign-out';
import { useUserNotificationsCounter } from '@/components/hooks/query-hooks/use-user-notifications';
import Badge, { BadgeWithCount } from '@/components/ui-custom/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQueryClient } from '@tanstack/react-query';
import { User } from 'lucia';
import { User2 } from 'lucide-react';
import { MessageKeys, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';
import LichessLogo from '../ui-custom/lichess-logo';
import { Button } from '../ui/button';

export default function AuthButton({ user }: AuthButtonProps) {
  const t = useTranslations('Menu');
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: signOut } = useSignOutMutation(queryClient);
  const { data: notificationsCounter } = useUserNotificationsCounter();

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
            <div className="gap-mk relative flex w-fit items-center">
              <User2 size={20} />
              <div className="hidden sm:block">{user.username}</div>
              {!!notificationsCounter && <Badge />}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="-translate-x-2 translate-y-1">
          {menuItems.map(({ path, title }) => (
            <Link href={path} key={title}>
              <StyledItem className="w-full">
                <div className="relative">{t(`Subs.${title}`)}</div>
                {title === 'inbox' && !!notificationsCounter && (
                  <BadgeWithCount count={notificationsCounter} />
                )}
              </StyledItem>
            </Link>
          ))}
          <StyledItem
            onClick={() => {
              signOut(undefined, {
                onSuccess: () => {
                  router.refresh();
                },
              });
            }}
          >
            {t('Profile.logout')}
          </StyledItem>
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
    title: 'inbox',
    path: '/inbox',
  },
  {
    title: 'settings',
    path: '/profile/settings',
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
