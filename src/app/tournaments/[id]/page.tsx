import Dashboard from '@/app/tournaments/[id]/dashboard';
import {
  tournamentQueryClient,
  tournamentQueryPrefetch,
} from '@/app/tournaments/[id]/prefetch';
import { publicCaller } from '@/server/api';
import { TournamentInfo } from '@/types/tournaments';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function TournamentPage(props: TournamentPageProps) {
  const params = await props.params;
  const session = (await cookies()).get('auth_session')?.value ?? '';
  const user = await publicCaller.user.auth();
  let tournament: TournamentInfo;
  try {
    tournament = await publicCaller.tournament.info({
      tournamentId: params.id,
    });
    tournamentQueryPrefetch(params.id);
  } catch (e) {
    console.log(e);
    notFound();
  }

  const status = await publicCaller.tournament.authStatus({
    tournamentId: params.id,
  });
  console.log(status);

  return (
    <HydrationBoundary state={dehydrate(tournamentQueryClient)}>
      <Dashboard
        session={session}
        id={params.id}
        status={status}
        userId={user?.id}
        currentRound={tournament.tournament.ongoing_round}
      />
    </HydrationBoundary>
  );
}

export interface TournamentPageProps {
  params: Promise<{ id: string }>;
}
