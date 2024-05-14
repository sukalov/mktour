import { db } from '@/lib/db';
import { tournaments } from '@/lib/db/schema/tournaments';

export default async function useAllTournamentsQuery() {
  const allTournaments = await db.select().from(tournaments);
  return { allTournaments };
}
