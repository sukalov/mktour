import Dashboard from '@/app/tournament/[id]/dashboard';
import { getUser } from '@/lib/auth/utils';
import useAllClubPlayersQuery from '@/lib/db/hooks/use-all-club-players-query';
import { useStatusInTournament } from '@/lib/db/hooks/use-status-in-tournament';
import { getTournamentState } from '@/lib/get-tournament-state';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

export const revalidate = 0;

export default async function TournamentPage({ params }: TournamentPageProps) {
  const user = await getUser();
  const state = await getTournamentState(params.id);
  if (!state) notFound();
  let status = await useStatusInTournament(user, params.id);
  if (!user || !status) redirect(`/tournament/${params.id}/view`);
  const session = cookies().get('auth_session')?.value ?? '';
  const possiblePlayers = await useAllClubPlayersQuery(params.id);
  const fullState = { ...state, possiblePlayers };

  return (
    <div className="w-full">
      <Dashboard state={state} session={session} />
    </div>
  );
}

export interface TournamentPageProps {
  params: { id: string };
}
