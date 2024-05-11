import TournamentPageContent from '@/app/tournament-beta/[id]/page-content';
import { cookies } from 'next/headers';

export default function SocketTestsPage({ params }: TournamentPageProps) {
  const session = cookies().get('auth_session')?.value ?? '';
  return (
    <div>
      <TournamentPageContent session={session} id={params.id}/>
    </div>
  );
};

export interface TournamentPageProps {
  params: { id: string };
}
