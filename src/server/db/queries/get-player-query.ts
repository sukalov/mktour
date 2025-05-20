import { db } from '@/server/db';
import { clubs, DatabaseClub } from '@/server/db/schema/clubs';
import { DatabasePlayer, players } from '@/server/db/schema/players';
import { DatabaseUser, users } from '@/server/db/schema/users';
import { eq } from 'drizzle-orm';

export default async function getPlayerQuery(
  id: string,
): Promise<PlayerToClubJoin | undefined> {
  const result = (
    await db
      .select()
      .from(players)
      .where(eq(players.id, id))
      .innerJoin(clubs, eq(players.club_id, clubs.id))
      .leftJoin(users, eq(players.user_id, users.id))
  ).at(0);

  return result;
}

interface PlayerToClubJoin {
  player: DatabasePlayer;
  club: DatabaseClub;
  user: DatabaseUser | null;
}
