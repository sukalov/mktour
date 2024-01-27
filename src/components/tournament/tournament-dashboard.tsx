import { atom, useAtom } from 'jotai';

import { NewTournamentForm } from '@/lib/zod/new-tournament-form';
import { Player, Tournament } from '@/lib/tournaments/models';
import PlayersList from '@/components/tournament/players-lits';
import { AddPlayerForm } from '@/components/tournament/add-player';

type TournamentDashboardProps = {
  data: NewTournamentForm;
  id: string;
};

export default async function TournamentDashboard({
  data,
  id,
}: TournamentDashboardProps) {
  return (
    <div>
      <AddPlayerForm />
      {/* @ts-expect-error Server Component */}
      <PlayersList tournamentId={id} />
    </div>
  );
}
