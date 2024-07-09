import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from 'lucia';
import { User2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

  const truthful = true;

  if (!user) {
    return (
      <>
        <Link href="/login/lichess">
          <Button className={`flex-row gap-2 p-2`} variant="ghost" size="icon">
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
            <User2 />
            <div className="hidden sm:block">{user.username}</div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="flex w-max justify-end"
          onClick={handleSignOut}
        >
          <DropdownMenuItem className="flex w-full justify-center">
            {t('logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export interface AuthButtonProps {
  user?: User | null;
}
