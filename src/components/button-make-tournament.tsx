import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MakeTournamentButton() {
  return (
    <Button
      className="flex h-20 w-full max-w-[28rem] grow flex-col gap-2 font-bold"
      variant="default"
    >
      <Link href="/new-tournament" className="w-full">
        <h1 className="text-xl font-light min-[320px]:text-2xl">
          make tournament
        </h1>
      </Link>
    </Button>
  );
}
