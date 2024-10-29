import { db } from '@/lib/db';
import { clubs, DatabaseClub, DatabaseTournament, tournaments } from '@/lib/db/schema/tournaments';
import { eq } from 'drizzle-orm';

export default async function getTournamentToClubQuery({
  params,
}: ParamsProps) {
  const result = (
    await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.id, params.id))
      .leftJoin(clubs, eq(tournaments.club_id, clubs.id))
  ).at(0) as TournamentToClubLeftJoin;

  if (!result?.tournament || !result?.club)
    return { tournament: undefined, club: undefined };
  return { tournament: result.tournament, club: result.club };
}

interface ParamsProps {
  params: { id: string };
}

interface TournamentToClubLeftJoin {
  tournament: DatabaseTournament;
  club: DatabaseClub;
}
