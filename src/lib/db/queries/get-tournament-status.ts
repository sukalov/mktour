import { db } from '@/lib/db';
import { tournaments } from '@/lib/db/schema/tournaments';
import { TournamentStatus } from '@/types/tournaments';
import { eq } from 'drizzle-orm';

export async function getTournamentStatus(
  id: string,
): Promise<TournamentStatus> {
  const tournamentInfo = (
    await db.select().from(tournaments).where(eq(tournaments.id, id))
  ).at(0);
  if (!tournamentInfo) throw new Error('TOURNAMENT NOT FOUND');
  if (tournamentInfo.closed_at && !tournamentInfo.started_at)
    throw new Error('TOURNAMENT_DATA_BROKEN');
  if (tournamentInfo.closed_at) return 'finished';
  if (tournamentInfo.started_at) return 'ongoing';
  return 'not started';
}
