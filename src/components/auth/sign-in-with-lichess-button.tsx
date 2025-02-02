import { Button } from '@/components/ui/button';
import LichessLogo from '@/components/ui/lichess-logo';
import { cn } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

interface SignInWithLichessButtonProps {
  className?: string;
  from?: string;
}

export default async function SignInWithLichessButton({
  className,
  from,
}: SignInWithLichessButtonProps) {
  const t = await getTranslations();
  return (
    <Link
      href={`/login/lichess${from ? '?from=' + from : ''}`}
      className="w-full"
    >
      <Button
        className={cn(
          `m-auto flex h-28 min-h-28 w-full max-w-[28rem] flex-none flex-col gap-2 px-1 font-bold [&_svg]:size-10`,
          className,
        )}
        variant="outline"
      >
        <div className="grid-flow-col"></div>
        <span className="grid-col-3">
          <LichessLogo size="40" />
        </span>
        <span className="grid-col--9 text-[1.4rem] leading-none font-light md:px-4 md:text-xl">
          {t('Home.sign in with lichess')}
        </span>
      </Button>
    </Link>
  );
}
