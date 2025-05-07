import { db } from '@/lib/db';
import { TournamentWithClub } from '@/lib/db/queries/get-tournaments-to-user-clubs-query';
import { clubs } from '@/lib/db/schema/clubs';
import { tournaments } from '@/lib/db/schema/tournaments';
import { eq } from 'drizzle-orm';

export default async function getAllTournamentsQuery() {
  const allTournaments = await db
    .select()
    .from(tournaments)
    .leftJoin(clubs, eq(tournaments.club_id, clubs.id));
  return allTournaments as TournamentWithClub[];
}
