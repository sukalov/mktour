'use server';

import { db } from '@/server/db';
import { players } from '@/server/db/schema/players';
import { and, eq, sql } from 'drizzle-orm';

export async function validateNewPlayer({
  name,
  club_id,
}: {
  name: string;
  club_id: string;
}) {
  const isValid = await db
    .select()
    .from(players)
    .where(
      and(
        sql`lower(${players.nickname}) = ${name.toLowerCase()}`,
        eq(players.club_id, club_id),
      ),
    )
    .get();

  return isValid === undefined;
}
