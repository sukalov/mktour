import { db } from '@/lib/db';
import {
  DatabaseClub,
  DatabaseTournament,
  clubs,
  tournaments,
} from '@/lib/db/schema/tournaments';
import { eq } from 'drizzle-orm';

export default async function useTournamentToClubQuery({
  params,
}: ParamsProps) {
  const { tournament, club } = (
    await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.id, params.id))
      .leftJoin(clubs, eq(tournaments.club_id, clubs.id))
  ).at(0) as TournamentToClubLeftJoin;

  return { tournament, club };
}

interface ParamsProps {
  params: { id: string };
}

interface TournamentToClubLeftJoin {
  tournament: DatabaseTournament;
  club: DatabaseClub;
}
