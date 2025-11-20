import { db } from '@/server/db';
import { clubs } from '@/server/db/schema/clubs';
import { tournaments } from '@/server/db/schema/tournaments';
import { eq } from 'drizzle-orm';

export default async function getAllTournaments() {
  'use cache';
  const allTournaments = await db
    .select()
    .from(tournaments)
    .innerJoin(clubs, eq(tournaments.clubId, clubs.id));
  return allTournaments;
}
