import { db } from '@/lib/db';
import { users } from '@/lib/db/schema/auth';
import {
  clubs,
  DatabaseClub,
  DatabasePlayer,
  players,
} from '@/lib/db/schema/tournaments';
import { eq } from 'drizzle-orm';
import { DatabaseUser } from 'lucia';

export default async function getPlayerQuery(
  id: string,
): Promise<PlayerToClubLeftJoin | undefined> {
  const result = (
    await db
      .select()
      .from(players)
      .where(eq(players.id, id))
      .leftJoin(clubs, eq(players.club_id, clubs.id))
      .leftJoin(users, eq(players.user_id, users.id))
  ).at(0) as PlayerToClubLeftJoin;

  if (!result?.player || !result?.club) return undefined;
  return result;
}

interface PlayerToClubLeftJoin {
  player: DatabasePlayer;
  club: DatabaseClub;
  user: DatabaseUser | null;
}
