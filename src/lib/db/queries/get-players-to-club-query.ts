import { db } from '@/lib/db';
import { players } from '@/lib/db/schema/tournaments';
import { eq } from 'drizzle-orm';
import { User } from 'lucia';

export default async function getPlayersToClubQuery(user: User) {
  const result = await db
    .select()
    .from(players)
    .where(eq(players.club_id, user.selected_club));

  return result;
}
