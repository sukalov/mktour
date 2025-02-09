import Dashboard from '@/app/tournaments/[id]/dashboard';
import {
  tournamentQueryClient,
  tournamentQueryPrefetch,
} from '@/app/tournaments/[id]/prefetch';
import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import { getStatusInTournament } from '@/lib/db/queries/get-status-in-tournament';
import { tournaments } from '@/lib/db/schema/tournaments';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function TournamentPage(props: TournamentPageProps) {
  const params = await props.params;
  const session = (await cookies()).get('auth_session')?.value ?? '';
  const { user } = await validateRequest();
  const tournament = (
    await db.select().from(tournaments).where(eq(tournaments.id, params.id))
  ).at(0);
  if (!tournament) notFound();
  await tournamentQueryPrefetch(params.id);

  let status = await getStatusInTournament(user, params.id);

  return (
    <HydrationBoundary state={dehydrate(tournamentQueryClient)}>
      <Dashboard
        session={session}
        id={params.id}
        status={status}
        userId={user?.id}
        currentRound={tournament.ongoing_round}
      />
    </HydrationBoundary>
  );
}

export interface TournamentPageProps {
  params: Promise<{ id: string }>;
}
