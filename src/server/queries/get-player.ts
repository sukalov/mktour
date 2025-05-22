import { db } from '@/server/db';
import { clubs } from '@/server/db/schema/clubs';
import { players } from '@/server/db/schema/players';
import { users } from '@/server/db/schema/users';
import { eq } from 'drizzle-orm';

export default async function getPlayer(playerId: string) {
  const [result] = await db
    .select()
    .from(players)
    .where(eq(players.id, playerId))
    .innerJoin(clubs, eq(players.club_id, clubs.id))
    .leftJoin(users, eq(players.user_id, users.id));

  return result;
}
