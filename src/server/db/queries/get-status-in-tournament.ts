import { db } from '@/server/db';
import { clubs_to_users } from '@/server/db/schema/clubs';
import { players } from '@/server/db/schema/players';
import {
  players_to_tournaments,
  tournaments,
} from '@/server/db/schema/tournaments';
import { and, eq } from 'drizzle-orm';
import { cache } from 'react';

export type Status = 'organizer' | 'player' | 'viewer';

export const getStatusInTournament = cache(
  async (userId: string | null, tournamentId: string): Promise<Status> => {
    if (!userId) return 'viewer';
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
            eq(clubs_to_users.user_id, userId),
          ),
        )
    ).at(0)?.status;
    if (dbStatus) return 'organizer';
    const player = (
      await db.select().from(players).where(eq(players.user_id, userId))
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
  },
);
