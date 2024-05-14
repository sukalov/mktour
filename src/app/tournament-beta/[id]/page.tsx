import TournamentPageContent from '@/app/tournament-beta/[id]/page-content';
import { getTournamentState } from '@/lib/get-tournament-state';
import { cookies } from 'next/headers';

export default async function TournamentPage({ params }: TournamentPageProps) {
  const session = cookies().get('auth_session')?.value ?? '';
  const state = await getTournamentState(params.id);
  return (
    <div>
      <TournamentPageContent session={session} id={params.id} state={state} />
    </div>
  );
}

export interface TournamentPageProps {
  params: { id: string };
}
