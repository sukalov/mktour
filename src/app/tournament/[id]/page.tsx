import Dashboard from '@/app/tournament/[id]/dashboard';
import { getUser } from '@/lib/auth/utils';
import { useStatusInTournament } from '@/lib/db/hooks/use-status-in-tournament';
import useAllClubPlayersQuery from '@/lib/db/hooks/user-all-club-players-query';
import { getTournamentState } from '@/lib/get-tournament-state';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

export const revalidate = 0;

export default async function TournamentPage({ params }: TournamentPageProps) {
  const user = await getUser();
  // const { tournament, club } = await useTournamentToClubQuery({ params });
  const tournament = await getTournamentState(params.id);
  if (!tournament) notFound();
  // const status = await useStatusQuery({ user, club });
  let status = await useStatusInTournament(user, params.id);
  if (!user || !status) redirect(`/tournament/${params.id}/view`);

  const session = cookies().get('auth_session')?.value ?? '';
  const possiblePlayers = await useAllClubPlayersQuery(params.id);
  const fullState = { ...tournament, possiblePlayers };

  return (
    <div className="w-full">
      <Dashboard tournament={tournament} />
    </div>
  );
}

export interface TournamentPageProps {
  params: { id: string };
}
