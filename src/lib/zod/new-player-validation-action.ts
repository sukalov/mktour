'use server';

import { NewPlayerFormType } from '@/lib/zod/new-player-form';
import { db } from '@/server/db';
import { players } from '@/server/db/schema/players';
import { and, eq, sql } from 'drizzle-orm';

export async function validateNewPlayer({
  nickname,
  clubId,
}: NewPlayerFormType) {
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
