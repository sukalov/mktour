'use server';

import { db } from '@/lib/db';
import { tournaments } from '@/lib/db/schema/tournaments';
import { eq } from 'drizzle-orm';

export const getClubTournaments = async (clubId: string) => {
  return await db
    .select()
    .from(tournaments)
    .where(eq(tournaments.club_id, clubId));
};
