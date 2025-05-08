import { db } from '@/lib/db';
import { DatabaseClub, clubs } from '@/lib/db/schema/clubs';
import { DatabasePlayer, players } from '@/lib/db/schema/players';
import { DatabaseUser, users } from '@/lib/db/schema/users';
import { eq } from 'drizzle-orm';

export default async function getPlayerQuery(
  id: string,
): Promise<PlayerToClubLeftJoin> {
  const result = (
    await db
      .select()
      .from(players)
      .where(eq(players.id, id))
      .leftJoin(clubs, eq(players.club_id, clubs.id))
      .leftJoin(users, eq(players.user_id, users.id))
  ).at(0) as PlayerToClubLeftJoin;

  return result;
}

interface PlayerToClubLeftJoin {
  player: DatabasePlayer;
  club: DatabaseClub;
  user: DatabaseUser | null;
}
