import { db } from '@/lib/db';
import { TournamentWithClub } from '@/lib/db/hooks/use-tournaments-to-user-clubs-query';
import { clubs, tournaments } from '@/lib/db/schema/tournaments';
import { eq } from 'drizzle-orm';

export default async function useAllTournamentsQuery() {
  const allTournaments = await db
    .select()
    .from(tournaments)
    .leftJoin(clubs, eq(tournaments.club_id, clubs.id));
  return allTournaments as TournamentWithClub[];
}
