import { db } from '@/server/db';
import { TournamentWithClub } from '@/server/db/queries/get-tournaments-to-user-clubs-query';
import { clubs } from '@/server/db/schema/clubs';
import { tournaments } from '@/server/db/schema/tournaments';
import { eq } from 'drizzle-orm';

export default async function getAllTournamentsQuery() {
  const allTournaments = await db
    .select()
    .from(tournaments)
    .innerJoin(clubs, eq(tournaments.club_id, clubs.id));
  return allTournaments as TournamentWithClub[];
}
