import TournamentPageContent from '@/app/tournament-beta/[id]/page-content';
import { getUser } from '@/lib/auth/utils';
import { useStatusInTournament } from '@/lib/db/hooks/use-status-in-tournament';
import useAllClubPlayersQuery from '@/lib/db/hooks/user-all-club-players-query';
import { getTournamentState } from '@/lib/get-tournament-state';
import { cookies } from 'next/headers';

export default async function TournamentPage({ params }: TournamentPageProps) {
  const session = cookies().get('auth_session')?.value ?? '';
  const state = await getTournamentState(params.id);
  const possiblePlayers = await useAllClubPlayersQuery(params.id)
  const fullState = {...state, possiblePlayers}
  const user = await getUser()
  let status = await useStatusInTournament(user, params.id);
  return (
    <div>
      <TournamentPageContent session={session} id={params.id} state={fullState} status={status} />
    </div>
  );
}

export interface TournamentPageProps {
  params: { id: string };
}
