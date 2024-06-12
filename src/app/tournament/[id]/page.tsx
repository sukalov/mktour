import Dashboard from '@/app/tournament/[id]/dashboard';
import { getTournamentState } from '@/lib/actions/get-tournament-state';
import { validateRequest } from '@/lib/auth/lucia';
import { useStatusInTournament } from '@/lib/db/hooks/use-status-in-tournament';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function TournamentPage({ params }: TournamentPageProps) {
  const session = cookies().get('auth_session')?.value ?? '';
  let state;
  try {
    state = await getTournamentState(params.id);
  } catch {
    notFound();
  }
  const { user } = await validateRequest();
  let status = await useStatusInTournament(user, params.id);

  return (
    <div className="w-full">
      <Dashboard
        state={state}
        session={session}
        id={params.id}
        status={status}
      />
    </div>
  );
}

export interface TournamentPageProps {
  params: { id: string };
}
