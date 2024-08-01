'use server';

import { db } from '@/lib/db';
import { clubs } from '@/lib/db/schema/tournaments';
import { eq } from 'drizzle-orm';

export async function validateLichessTeam({
  lichess_team,
}: {
  lichess_team?: string;
}) {
  if (!lichess_team) return undefined;
  return await db
    .select()
    .from(clubs)
    .where(eq(clubs.lichess_team, lichess_team))
    .get();
}
