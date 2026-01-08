'use server';

import { db } from '@/server/db';
import { clubs, DatabaseClub } from '@/server/db/schema/clubs';
import { eq } from 'drizzle-orm';

export async function validateLichessTeam({
  lichessTeam,
}: {
  lichessTeam?: string | null;
}): Promise<DatabaseClub | undefined> {
  if (!lichessTeam) return undefined;
  return await db
    .select()
    .from(clubs)
    .where(eq(clubs.lichessTeam, lichessTeam))
    .get();
}
