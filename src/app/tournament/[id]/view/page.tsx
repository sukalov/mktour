import Dashboard from '@/app/tournament/[id]/dashboard';
import { TournamentPageProps } from '@/app/tournament/[id]/page';
import useTournamentToClubQuery from '@/lib/db/hooks/useTournamentToClubQuery';

export default async function TournamentView({ params }: TournamentPageProps) {
  const { tournament } = await useTournamentToClubQuery({ params });

  return (
    <div className="w-full">
      <Dashboard tournament={tournament} />
    </div>
  );
}
