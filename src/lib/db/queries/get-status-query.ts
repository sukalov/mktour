import { db } from '@/lib/db';
import { clubs_to_users } from '@/lib/db/schema/clubs';
import { and, eq } from 'drizzle-orm';
import { User } from 'lucia';

export default async function getStatus({ user, club }: UserClubsQueryProps) {
  if (!user) return undefined;
  return (
    (
      await db
        .select()
        .from(clubs_to_users)
        .where(
          and(
            eq(clubs_to_users.user_id, user.id),
            eq(clubs_to_users.club_id, club.id),
          ),
        )
    )[0]?.status ?? undefined
  );
}

export type UserClubsQueryProps = {
  user?: User | null;
  club: {
    id: string;
    name: string;
    lichess_team: string | null;
  };
};
