import TournamentsContainer from '@/app/tournaments/tournament-iteratee';
import { validateRequest } from '@/lib/auth/lucia';
import useTournamentsToUserClubsQuery from '@/lib/db/hooks/use-tournaments-to-user-clubs-query';
import { redirect } from 'next/navigation';

export default async function MyTournaments() {
  const { user } = await validateRequest();
  if (!user) redirect('sign-in');
  const tournaments = await useTournamentsToUserClubsQuery({ user });

  return (
    <main className="m-4 flex flex-col items-center gap-4">
      <TournamentsContainer props={tournaments} grouped />
    </main>
  );
}
