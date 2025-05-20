import TournamentItemIteratee from '@/components/tournament-item';
import { publicCaller } from '@/server/api';

export const revalidate = 0;

export default async function Tournaments() {
  const allTournaments = await publicCaller.tournament.all();

  return (
    <main className="mk-container mk-list">
      {allTournaments.map((props) => (
        <TournamentItemIteratee key={props.tournament.id} {...props} />
      ))}
    </main>
  );
}
