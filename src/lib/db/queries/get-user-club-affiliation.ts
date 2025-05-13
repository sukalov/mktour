import { db } from '@/lib/db';
import { affiliations, DatabaseAffiliation } from '@/lib/db/schema/players';
import { and, eq } from 'drizzle-orm';
import { User } from 'lucia';

export const getUserClubAffiliation = async (
  user: User | null,
  clubId: string,
): Promise<DatabaseAffiliation | undefined> => {
  if (!user) throw new Error('USER_NOT_FOUND');

  return (
    await db
      .select()
      .from(affiliations)
      .where(
        and(
          eq(affiliations.club_id, clubId),
          eq(affiliations.user_id, user.id),
        ),
      )
  ).at(0);
};
