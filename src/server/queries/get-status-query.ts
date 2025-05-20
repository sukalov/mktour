import { db } from '@/server/db';
import { clubs_to_users } from '@/server/db/schema/clubs';
import { and, eq } from 'drizzle-orm';
import { User } from 'lucia';

export default async function getStatus({ user, clubId }: UserClubsQueryProps) {
  if (!user) return undefined;
  return (
    (
      await db
        .select()
        .from(clubs_to_users)
        .where(
          and(
            eq(clubs_to_users.user_id, user.id),
            eq(clubs_to_users.club_id, clubId),
          ),
        )
    )[0]?.status ?? undefined
  );
}

export type UserClubsQueryProps = {
  user?: User | null;
  clubId: string;
};
