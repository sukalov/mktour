import TournamentItemIteratee from '@/components/tournament-item';
import getAllTournamentsQuery from '@/lib/db/queries/get-all-tournaments-query';

export const revalidate = 0;

export default async function Tournaments() {
  const allTournaments = await getAllTournamentsQuery();

  return (
    <main className="m-4 flex flex-col items-center gap-4">
      {allTournaments.map((props) => (
        <TournamentItemIteratee
          key={props.tournament.id}
          {...props}
          showClubName
        />
      ))}
    </main>
  );
}
