import TournamentsContainer from '@/app/tournaments/tournament-iteratee';
import { getUser } from '@/lib/auth/utils';
import useTournamentsToUserClubsQuery from '@/lib/db/hooks/use-tournaments-to-user-clubs-query';

export default async function MyTournaments() {
  const user = await getUser();
  const tournaments = await useTournamentsToUserClubsQuery({ user });

  return (
    <main className="m-4 flex flex-col items-center gap-4">
      <TournamentsContainer props={tournaments} grouped />
    </main>
  );
}
