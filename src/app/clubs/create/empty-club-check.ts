import { db } from '@/server/db';
import getUserToClubs from '@/server/db/queries/get-user-to-clubs';
import { DatabaseClub } from '@/server/db/schema/clubs';
import { tournaments } from '@/server/db/schema/tournaments';
import { and, eq, isNotNull } from 'drizzle-orm';
import { User } from 'lucia';

export const emptyClubCheck = async ({
  user,
}: {
  user: User;
}): Promise<DatabaseClub | null> => {
  const userToClubs = await getUserToClubs({ user });
  const clubsList = userToClubs.map((el) => el.club) as DatabaseClub[];
  for (const club in clubsList) {
    const finishedClubTournament = (
      await db
        .select()
        .from(tournaments)
        .where(
          and(
            eq(tournaments.club_id, clubsList[club].id),
            isNotNull(tournaments.closed_at),
          ),
        )
        .limit(1)
    ).at(0);
    if (!finishedClubTournament) return clubsList[club];
  }
  return null;
};
