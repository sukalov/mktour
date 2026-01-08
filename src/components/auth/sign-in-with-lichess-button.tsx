import LichessLogo from '@/components/ui-custom/lichess-logo';
import { Button } from '@/components/ui/button';
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
    <Button
      className={cn(
        `m-auto flex h-28 min-h-28 w-full max-w-md flex-none flex-col gap-2 px-1 font-bold`,
        className,
      )}
      variant="outline"
      asChild
    >
      <Link
        href={`/login/lichess${from ? '?from=' + from : ''}`}
        className="w-full"
      >
        <div className="grid-flow-col"></div>
        <span className="grid-col-3">
          <LichessLogo className="size-10" />
        </span>
        <span className="grid-col--9 text-[1.4rem] leading-none font-light md:px-4 md:text-xl">
          {t('Home.sign in with lichess')}
        </span>
      </Link>
    </Button>
  );
}
