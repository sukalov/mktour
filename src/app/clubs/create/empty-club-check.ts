import { db } from '@/server/db';
import { DatabaseClub } from '@/server/db/schema/clubs';
import { tournaments } from '@/server/db/schema/tournaments';
import { getUserClubs } from '@/server/queries/get-user-clubs';
import { and, eq, isNotNull } from 'drizzle-orm';
import { User } from 'lucia';

export const emptyClubCheck = async ({
  user,
}: {
  user: User;
}): Promise<DatabaseClub | null> => {
  const clubsList = await getUserClubs({ userId: user.id });
  for (const club in clubsList) {
    const finishedClubTournament = (
      await db
        .select()
        .from(tournaments)
        .where(
          and(
            eq(tournaments.clubId, clubsList[club].id),
            isNotNull(tournaments.closedAt),
          ),
        )
        .limit(1)
    ).at(0);
    if (!finishedClubTournament) return clubsList[club];
  }
  return null;
};
