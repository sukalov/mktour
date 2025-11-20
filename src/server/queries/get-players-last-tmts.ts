import { db } from '@/server/db';
import {
  DatabasePlayerToTournament,
  DatabaseTournament,
  players_to_tournaments,
  tournaments,
} from '@/server/db/schema/tournaments';
import { desc, eq } from 'drizzle-orm';

// returns the last 5 tournaments a player participated in
export default async function getPlayersLastTmts(playerId: string): Promise<
  | {
      players_to_tournaments: DatabasePlayerToTournament;
      tournament: DatabaseTournament | null;
    }[]
  | null
> {
  return await db
    .select()
    .from(players_to_tournaments)
    .where(eq(players_to_tournaments.playerId, playerId))
    .innerJoin(
      tournaments,
      eq(players_to_tournaments.tournamentId, tournaments.id),
    )
    .orderBy(desc(tournaments.startedAt))
    .limit(5);
}
