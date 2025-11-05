import { db } from '@/server/db';
import { clubs_to_users, StatusInClub } from '@/server/db/schema/clubs';
import { and, eq } from 'drizzle-orm';
import { cache } from 'react';

export async function uncachedGetStatusInClub({
  userId,
  clubId,
}: UserClubsQueryProps): Promise<StatusInClub | undefined> {
  return (
    await db
      .select()
      .from(clubs_to_users)
      .where(
        and(
          eq(clubs_to_users.user_id, userId),
          eq(clubs_to_users.club_id, clubId),
        ),
      )
  )[0]?.status;
}

const getStatusInClub = cache(uncachedGetStatusInClub);

export default getStatusInClub;

type UserClubsQueryProps = {
  userId: string;
  clubId: string;
};
