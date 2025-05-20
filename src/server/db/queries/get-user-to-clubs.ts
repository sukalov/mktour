import { db } from '@/server/db';
import { UserClubsQueryProps } from '@/server/db/queries/get-status-query';
import { clubs, clubs_to_users } from '@/server/db/schema/clubs';
import { eq } from 'drizzle-orm';

export default async function getUserToClubs({
  user,
}: Pick<UserClubsQueryProps, 'user'>) {
  if (!user) throw new Error('USER_UNDEFINED');
  return await db
    .select()
    .from(clubs_to_users)
    .where(eq(clubs_to_users.user_id, user.id))
    .innerJoin(clubs, eq(clubs_to_users.club_id, clubs.id));
}
