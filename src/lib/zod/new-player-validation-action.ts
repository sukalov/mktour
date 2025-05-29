'use server';

import { db } from '@/server/db';
import { players } from '@/server/db/schema/players';
import { sql } from 'drizzle-orm';

export async function validateNewPlayer({ name }: { name: string }) {
  const isValid = await db
    .select()
    .from(players)
    .where(sql`lower(${players.nickname}) = ${name.toLowerCase()}`)
    .get();

  return isValid === undefined;
}
