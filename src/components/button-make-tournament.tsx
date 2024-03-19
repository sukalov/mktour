import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MakeTournamentButton() {
  return (
    <Link href="/new-tournament" className="m-auto w-full">
      <Button
        className="m-auto flex p-8 flex-col gap-2 font-bold"
        variant="default"
      >
        <h1 className=" text-xl font-light min-[320px]:text-xl">
          make tournament
        </h1>
      </Button>
    </Link>
  );
}
