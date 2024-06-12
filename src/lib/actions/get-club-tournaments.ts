'use server';

import { db } from '@/lib/db';
import { tournaments } from '@/lib/db/schema/tournaments';
import { timeout } from '@/lib/utils';

export const getClubTournaments = async () => {
  await timeout(2000);
  const tournamentsDb = await db.select().from(tournaments);
  return tournamentsDb;
};
