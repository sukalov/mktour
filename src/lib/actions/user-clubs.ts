'use server';

import { db } from '@/lib/db';
import { clubs, clubs_to_users } from '@/lib/db/schema/tournaments';
import { eq } from 'drizzle-orm';

export default async function getUserClubs({ userId }: { userId: string }) {
  return await db
    .select({
      id: clubs.id,
      name: clubs.name,
    })
    .from(clubs_to_users)
    .where(eq(clubs_to_users.user_id, userId))
    .leftJoin(clubs, eq(clubs_to_users.club_id, clubs.id));
}
