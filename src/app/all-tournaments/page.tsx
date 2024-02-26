import TournamentsContainer from '@/app/all-tournaments/tournament-iteratee';
import useAllTournamentsQuery from '@/lib/db/hooks/useAllTournamentsQuery';

export default async function Tournaments() {
  const { allTournaments } = await useAllTournamentsQuery();
  return (
    <main className="flex flex-col items-center m-4 gap-4">
      <TournamentsContainer props={allTournaments} />
    </main>
  );
}
