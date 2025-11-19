'use server';

import { db } from '@/server/db';
import { clubs, DatabaseClub } from '@/server/db/schema/clubs';
import { eq } from 'drizzle-orm';

export async function validateLichessTeam({
  lichess_team,
}: {
  lichess_team?: string | null;
}): Promise<DatabaseClub | undefined> {
  if (!lichess_team) return undefined;
  return await db
    .select()
    .from(clubs)
    .where(eq(clubs.lichess_team, lichess_team))
    .get();
}
