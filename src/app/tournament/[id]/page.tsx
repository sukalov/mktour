import Dashboard from '@/app/tournament/[id]/dashboard';
import { queryClient, queryPrefetch } from '@/app/tournament/[id]/prefetch';
import { getTournamentState } from '@/lib/actions/get-tournament-state';
import { validateRequest } from '@/lib/auth/lucia';
import { useStatusInTournament } from '@/lib/db/hooks/use-status-in-tournament';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

export const revalidate = 0;

export default async function TournamentPage({ params }: TournamentPageProps) {
  const session = cookies().get('auth_session')?.value ?? '';
  const { user } = await validateRequest();
  await queryPrefetch(params.id);

  let state;
  try {
    state = await getTournamentState(params.id);
  } catch {
    notFound();
  }

  let status = await useStatusInTournament(user, params.id);

  if (!user || !status) redirect(`/tournament/${params.id}/view`);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full">
        <Dashboard state={state} session={session} id={params.id} status={status} />
      </div>
    </HydrationBoundary>
  );
}

export interface TournamentPageProps {
  params: { id: string };
}
