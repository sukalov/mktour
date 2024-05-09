import Dashboard from '@/app/tournament/[id]/dashboard';
import { TournamentPageProps } from '@/app/tournament/[id]/page';
import useTournamentToClubQuery from '@/lib/db/hooks/useTournamentToClubQuery';
import { notFound } from 'next/navigation';

export default async function TournamentView({ params }: TournamentPageProps) {
  const { tournament } = await useTournamentToClubQuery({ params });
  if (!tournament) notFound();

  return (
    <div className="w-full">
      <Dashboard tournament={tournament} />
    </div>
  );
}
