import { DeleteForm } from '@/components/tournament/delete-player';
import { db } from '@/lib/db';
import {
  players,
  playersToTournaments,
  tournaments,
} from '@/lib/db/schema/tournaments';
import { eq } from 'drizzle-orm';

interface PlayersListProps {
  tournamentId: string;
}

export default async function PlayersList({ tournamentId }: PlayersListProps) {
  //   let participants = await db.select()
  //   .from(playersToTournaments)
  //   .leftJoin(players, eq(playersToTournaments.player_id, players.id))
  //   .leftJoin(tournaments, eq(playersToTournaments.tournament_id, tournaments.id))
  //   .where(eq(tournaments.id, tournamentId))
  //   .all()

  const participants = await db.select().from(players);
  console.log(participants);

  return (
    <main>
      <h1 className="sr-only">players</h1>
      <ul className="pt-4">
        {participants.map((participant) => (
          <li key={participant.id}>
            {participant.name}
            <DeleteForm id={participant.id} name={participant.name} />
          </li>
        ))}
      </ul>
    </main>
  );
}
