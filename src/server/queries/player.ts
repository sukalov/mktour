import { db } from '@/server/db';
import {
  players_to_tournaments,
  tournaments,
} from '@/server/db/schema/tournaments';
import { desc, eq, getTableColumns } from 'drizzle-orm';

// returns the last 5 tournaments a player participated in
export default async function getPlayersTournaments(
  playerId: string,
  limit: number = 5,
  offset: number = 0,
) {
  return await db
    .select({
      ...getTableColumns(players_to_tournaments),
      tournament: tournaments,
    })
    .from(players_to_tournaments)
    .where(eq(players_to_tournaments.playerId, playerId))
    .innerJoin(
      tournaments,
      eq(players_to_tournaments.tournamentId, tournaments.id),
    )
    .orderBy(desc(tournaments.createdAt))
    .limit(limit)
    .offset(offset);
}
