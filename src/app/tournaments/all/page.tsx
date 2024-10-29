import TournamentsContainer from '@/app/tournaments/tournament-container';
import getAllTournamentsQuery from '@/lib/db/queries/get-all-tournaments-query';

export const revalidate = 0;

export default async function Tournaments() {
  const allTournaments = await getAllTournamentsQuery();

  return (
    <main className="m-4 flex flex-col items-center gap-4">
      <TournamentsContainer props={allTournaments} />
    </main>
  );
}
