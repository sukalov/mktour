import { db } from '@/server/db';
import { affiliations, DatabaseAffiliation } from '@/server/db/schema/players';
import { and, eq } from 'drizzle-orm';
import { User } from 'lucia';

export async function getUserClubAffiliation(
  user: User | null,
  clubId: string,
): Promise<DatabaseAffiliation[]> {
  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }

  const affiliation = await db
    .select()
    .from(affiliations)
    .where(
      and(eq(affiliations.clubId, clubId), eq(affiliations.userId, user.id)),
    );

  return affiliation;
}
