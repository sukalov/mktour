import Dashboard from '@/app/tournament/[id]/dashboard';
import { TournamentPageProps } from '@/app/tournament/[id]/page';
import { getTournamentState } from '@/lib/get-tournament-state';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export default async function TournamentView({ params }: TournamentPageProps) {
  const state = await getTournamentState(params.id);
  const session = cookies().get('auth_session')?.value ?? '';

  if (!state) notFound();

  return (
    <div className="w-full">
      <Dashboard state={state} session={session} />
    </div>
  );
}
