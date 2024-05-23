'use server';

import { db } from '@/lib/db';
import { players } from '@/lib/db/schema/tournaments';
import { and, eq } from 'drizzle-orm';

export async function validateData({
  name,
  club_id,
}: {
  name: string;
  club_id: string;
}) {
  const isValid =
    (
      await db
        .select()
        .from(players)
        .where(and(eq(players.nickname, name), eq(players.club_id, club_id)))
    )[0] === undefined;
  return isValid;
}
