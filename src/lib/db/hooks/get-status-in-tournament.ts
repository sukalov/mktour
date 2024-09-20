import { db } from '@/lib/db';
import {
  clubs_to_users,
  players,
  players_to_tournaments,
  tournaments,
} from '@/lib/db/schema/tournaments';
import { and, eq } from 'drizzle-orm';
import type { User } from 'lucia';

export type Status = 'organizer' | 'player' | 'viewer';

export const getStatusInTournament = async (
  user: User | null,
  tournamentId: string,
): Promise<Status> => {
  if (!user) return 'viewer';
  const clubId = (
    await db
      .select({ club: tournaments.club_id })
      .from(tournaments)
      .where(eq(tournaments.id, tournamentId))
  ).at(0)?.club;
  if (!clubId) throw new Error('cannot resolve tournament organizer');

  const dbStatus = (
    await db
      .select({ status: clubs_to_users.status })
      .from(clubs_to_users)
      .where(
        and(
          eq(clubs_to_users.club_id, clubId),
          eq(clubs_to_users.user_id, user.id),
        ),
      )
  ).at(0)?.status;
  if (dbStatus) return 'organizer';
  const player = (
    await db.select().from(players).where(eq(players.user_id, user.id))
  ).at(0);
  if (!player) return 'viewer';
  const isHere = (
    await db
      .select()
      .from(players_to_tournaments)
      .where(
        and(
          eq(players_to_tournaments.player_id, player.id),
          eq(players_to_tournaments.tournament_id, tournamentId),
        ),
      )
  ).at(0);
  if (isHere) return 'player';
  else return 'viewer';
};
