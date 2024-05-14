import TournamentsContainer from '@/app/all-tournaments/tournament-iteratee';
import useAllTournamentsQuery from '@/lib/db/hooks/use-all-tournaments-query';

export default async function Tournaments() {
  const { allTournaments } = await useAllTournamentsQuery();
  return (
    <main className="m-4 flex flex-col items-center gap-4">
      <TournamentsContainer props={allTournaments} />
    </main>
  );
}
