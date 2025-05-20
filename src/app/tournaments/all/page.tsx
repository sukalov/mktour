import TournamentItemIteratee from '@/components/tournament-item';
import getAllTournamentsQuery from '@/server/db/queries/get-all-tournaments-query';

export const revalidate = 0;

export default async function Tournaments() {
  const allTournaments = await getAllTournamentsQuery();

  return (
    <main className="mk-container mk-list">
      {allTournaments.map((props) => (
        <TournamentItemIteratee key={props.tournament.id} {...props} />
      ))}
    </main>
  );
}
