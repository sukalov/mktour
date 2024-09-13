import { db } from '@/lib/db';
import {
  DatabaseClub,
  DatabaseTournament,
  clubs,
  clubs_to_users,
  tournaments,
} from '@/lib/db/schema/tournaments';
import { eq, inArray } from 'drizzle-orm';

export default async function useTournamentsToUserClubsQuery({
  user,
}: Pick<UserClubsQueryProps, 'user'>) {
  // Get the club IDs the user is associated with
  const userClubs = await db
    .select()
    .from(clubs_to_users)
    .where(eq(clubs_to_users.user_id, user.id));

  const clubIds = userClubs.map((club) => club.club_id);

  if (clubIds.length === 0) {
    return [];
  }

  // Get the tournaments associated with these clubs
  const tournamentsFromUserClubs = await db
    .select({
      tournament: tournaments,
      club: clubs,
    })
    .from(tournaments)
    .leftJoin(clubs, eq(tournaments.club_id, clubs.id))
    .where(inArray(tournaments.club_id, clubIds));

  return tournamentsFromUserClubs as TournamentWithClub[];
}

interface UserClubsQueryProps {
  user: { id: string };
}

export interface TournamentWithClub {
  tournament: DatabaseTournament;
  club: DatabaseClub;
}
