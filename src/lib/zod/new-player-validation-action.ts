'use server';

import { db } from '@/server/db';
import { players } from '@/server/db/schema/players';
import { and, eq, sql } from 'drizzle-orm';

export async function validateNewPlayer({
  nickname,
  clubId,
}: {
  nickname: string;
  clubId: string;
}) {
  const isValid = await db
    .select()
    .from(players)
    .where(
      and(
        sql`lower(${players.nickname}) = ${nickname.toLowerCase()}`,
        eq(players.clubId, clubId),
      ),
    )
    .get();

  return isValid === undefined;
}
