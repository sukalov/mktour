import { Button } from '@/components/ui/button';
import LichessLogo from '@/components/ui/lichess-logo';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SignInWithLichessButtonProps {
  className?: string;
}

export default function SignInWithLichessButton({
  className,
}: SignInWithLichessButtonProps) {
  return (
    <Button
      className={cn(
        `flex h-20 w-full max-w-[28rem] grow flex-col gap-2 font-bold`,
        className,
      )}
      variant="outline"
    >
      <Link href={'/login/lichess'} className="w-full">
        <div className="flex items-center justify-center gap-2">
          <span className="grid-col-3">
            <LichessLogo size="30" />
          </span>
          <span className="whitespace-nowrap text-xl font-light leading-none md:text-2xl">
            sign in with lichess
          </span>
        </div>
      </Link>
    </Button>
  );
}
