import { db } from '@/server/db';
import { clubs, DatabaseClub } from '@/server/db/schema/clubs';
import { asc } from 'drizzle-orm';

export default async function getAllClubs() {
  // page: number = 1,
  // pageSize: number = 10
  const allClubs = await db
    .select()
    .from(clubs)
    .orderBy(asc(clubs.created_at))
    // .limit(pageSize)
    // .offset((page - 1) * pageSize)
    .$dynamic();
  return allClubs as DatabaseClub[];
}
