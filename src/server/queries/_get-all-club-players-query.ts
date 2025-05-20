import { db } from '@/server/db';
import { DatabasePlayer, players } from '@/server/db/schema/players';
import { eq } from 'drizzle-orm';

export default async function getAllClubPlayersQuery(
  club_id: string,
): Promise<Array<DatabasePlayer>> {
  return await db.select().from(players).where(eq(players.club_id, club_id));
}
