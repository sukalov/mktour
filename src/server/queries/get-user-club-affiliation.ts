import { db } from '@/server/db';
import { affiliations, DatabaseAffiliation } from '@/server/db/schema/players';
import { and, eq } from 'drizzle-orm';
import { User } from 'lucia';

export const getUserClubAffiliation = async (
  user: User | null,
  clubId: string,
): Promise<DatabaseAffiliation | undefined> => {
  if (!user) throw new Error('USER_NOT_FOUND');
  const res = await db
    .select()
    .from(affiliations)
    .where(
      and(eq(affiliations.club_id, clubId), eq(affiliations.user_id, user.id)),
    );

  return res[0] ?? undefined;
};
