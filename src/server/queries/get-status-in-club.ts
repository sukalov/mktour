import { db } from '@/server/db';
import { clubs_to_users } from '@/server/db/schema/clubs';
import { and, eq } from 'drizzle-orm';

export default async function getStatusInClub({
  userId,
  clubId,
}: UserClubsQueryProps) {
  return (
    (
      await db
        .select()
        .from(clubs_to_users)
        .where(
          and(
            eq(clubs_to_users.user_id, userId),
            eq(clubs_to_users.club_id, clubId),
          ),
        )
    )[0]?.status ?? undefined
  );
}

export type UserClubsQueryProps = {
  userId: string;
  clubId: string;
};
