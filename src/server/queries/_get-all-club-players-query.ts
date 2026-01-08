import { db } from '@/server/db';
import { DatabasePlayer, players } from '@/server/db/schema/players';
import { eq } from 'drizzle-orm';

export default async function getAllClubPlayersQuery(
  clubId: string,
): Promise<Array<DatabasePlayer>> {
  return await db.select().from(players).where(eq(players.clubId, clubId));
}
