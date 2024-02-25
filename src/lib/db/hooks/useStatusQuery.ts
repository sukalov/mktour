import { db } from '@/lib/db';
import { clubs_to_users } from '@/lib/db/schema/tournaments';
import { and, eq } from 'drizzle-orm';
import { User } from 'lucia';

export default async function useStatusQuery({ user, club }: UserClubsQueryProps) {
  return (
    await db
      .select()
      .from(clubs_to_users)
      .where(
        and(
          eq(clubs_to_users.user_id, user.id),
          eq(clubs_to_users.club_id, club.id),
        ),
      )
  )[0]?.status;
}

export type UserClubsQueryProps = {
  user: User;
  club: {
    id: string;
    name: string;
    lichess_team: string | null;
  };
};
