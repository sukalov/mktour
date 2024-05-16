import Dashboard from '@/app/tournament/[id]/dashboard';
import { TournamentPageProps } from '@/app/tournament/[id]/page';
import { getUser } from '@/lib/auth/utils';
import { useStatusInTournament } from '@/lib/db/hooks/use-status-in-tournament';
import { getTournamentState } from '@/lib/get-tournament-state';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export default async function TournamentView({ params }: TournamentPageProps) {
  const user = await getUser();
  let state;

  try {
    state = await getTournamentState(params.id);
  } catch {
    notFound();
  }
  const session = cookies().get('auth_session')?.value ?? '';
  let status = await useStatusInTournament(user, params.id);

  return (
    <div className="w-full">
      <Dashboard
        state={state}
        session={session}
        status={status}
        id={params.id}
      />
    </div>
  );
}
