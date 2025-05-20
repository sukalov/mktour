'use server';

import { db } from '@/server/db';
import { clubs, clubs_to_users } from '@/server/db/schema/clubs';
import { eq } from 'drizzle-orm';
import { cache } from 'react';

export default async function getUserClubs({ userId }: { userId: string }) {
  return await db
    .select({
      id: clubs.id,
      name: clubs.name,
    })
    .from(clubs_to_users)
    .where(eq(clubs_to_users.user_id, userId))
    .innerJoin(clubs, eq(clubs_to_users.club_id, clubs.id));
}

export async function uncachedGetUserClubIds({ userId }: { userId: string }) {
  return (
    await db
      .select({
        id: clubs.id,
      })
      .from(clubs_to_users)
      .where(eq(clubs_to_users.user_id, userId))
      .innerJoin(clubs, eq(clubs_to_users.club_id, clubs.id))
  ).map((el) => el.id);
}

export const getUserClubIds = cache(uncachedGetUserClubIds);
