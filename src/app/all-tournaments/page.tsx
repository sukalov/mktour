import TournamentsContainer from '@/app/all-tournaments/tournament-iteratee';
import useAllTournamentsQuery from '@/lib/db/hooks/useAllTournamentsQuery';

export default async function Tournaments() {
  const { allTournaments } = await useAllTournamentsQuery();
  return (
    <main className="flex flex-col items-center">
      <TournamentsContainer props={allTournaments} />
    </main>
  );
}
