import { db } from '@/lib/db';
import { DatabasePlayer, players } from '@/lib/db/schema/tournaments';
import { eq } from 'drizzle-orm';

export default async function useAllClubPlayersQuery(
  club_id: string,
): Promise<Array<DatabasePlayer>> {
  return await db.select().from(players).where(eq(players.club_id, club_id));
}
