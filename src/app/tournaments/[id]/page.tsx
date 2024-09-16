import Dashboard from '@/app/tournaments/[id]/dashboard';
import {
  tournamentQueryClient,
  tournamentQueryPrefetch,
} from '@/app/tournaments/[id]/prefetch';
import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import { useStatusInTournament } from '@/lib/db/hooks/use-status-in-tournament';
import { tournaments } from '@/lib/db/schema/tournaments';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function TournamentPage({ params }: TournamentPageProps) {
  const session = cookies().get('auth_session')?.value ?? '';
  const { user } = await validateRequest();
  await tournamentQueryPrefetch(params.id);

  const tournament = (
    await db.select().from(tournaments).where(eq(tournaments.id, params.id))
  ).at(0);
  
  if (!tournament) notFound();

  let status = await useStatusInTournament(user, params.id);

  return (
    <HydrationBoundary state={dehydrate(tournamentQueryClient)}>
      <div className="w-full">
        <Dashboard
          session={session}
          id={params.id}
          status={status}
          userId={user?.id}
        />
      </div>
    </HydrationBoundary>
  );
}

export interface TournamentPageProps {
  params: { id: string };
}
