'use server';

import { db } from '@/server/db';
import { clubs, clubs_to_users, StatusInClub } from '@/server/db/schema/clubs';
import { eq } from 'drizzle-orm';
import { cache } from 'react';

export async function getUserClubNames({ userId }: { userId: string }) {
  return await db
    .select({
      id: clubs.id,
      name: clubs.name,
    })
    .from(clubs_to_users)
    .where(eq(clubs_to_users.user_id, userId))
    .innerJoin(clubs, eq(clubs_to_users.club_id, clubs.id));
}

export async function getUserClubs({ userId }: { userId: string }) {
  return (
    await db
      .select()
      .from(clubs_to_users)
      .where(eq(clubs_to_users.user_id, userId))
      .innerJoin(clubs, eq(clubs_to_users.club_id, clubs.id))
  ).map((el) => el.club);
}

export async function uncachedGetUserClubIds({ userId }: { userId: string }) {
  return (
    await db
      .select({
        id: clubs.id,
        status: clubs_to_users.status,
      })
      .from(clubs_to_users)
      .where(eq(clubs_to_users.user_id, userId))
      .innerJoin(clubs, eq(clubs_to_users.club_id, clubs.id))
  ).reduce(
    (acc, curr) => {
      acc[curr.id] = curr.status;
      return acc;
    },
    {} as Record<string, StatusInClub>,
  );
}

export const getUserClubIds = cache(uncachedGetUserClubIds);
