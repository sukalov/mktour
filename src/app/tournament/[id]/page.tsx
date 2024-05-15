import Dashboard from '@/app/tournament/[id]/dashboard';
import { getUser } from '@/lib/auth/utils';
import { useStatusInTournament } from '@/lib/db/hooks/use-status-in-tournament';
import { getTournamentState } from '@/lib/get-tournament-state';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

export const revalidate = 0;

export default async function TournamentPage({ params }: TournamentPageProps) {
  const session = cookies().get('auth_session')?.value ?? '';
  const state = await getTournamentState(params.id);
  const user = await getUser();
  let status = await useStatusInTournament(user, params.id);

  console.log(session, state, user, status)

  if (!state) notFound();
  if (!user || !status) redirect(`/tournament/${params.id}/view`);

  return (
    <div className="w-full">
      <Dashboard state={state} session={session} id={params.id} status={status} />
    </div>
  );
}

export interface TournamentPageProps {
  params: { id: string };
}
