'use server';

import { getUser } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema/auth';
import {
  DatabaseClubsToUsers,
  clubs,
  clubs_to_users,
} from '@/lib/db/schema/tournaments';
import { newid } from '@/lib/utils';
import { NewClubFormType } from '@/lib/zod/new-club-form';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export const createClub = async (values: NewClubFormType) => {
  const requestor = await getUser();
  if (!requestor) throw new Error('unauthorized request');
  const id = newid();
  const newClub = {
    ...values,
    id,
  };
  const newRelation: DatabaseClubsToUsers = {
    id: `${requestor.id}=${id}`,
    club_id: id,
    user_id: requestor.id,
    status: 'admin',
  };
  try {
    await db.insert(clubs).values(newClub);
    await db.insert(clubs_to_users).values(newRelation);
    if (values.set_default) {
      await db
        .update(users)
        .set({ default_club: id })
        .where(eq(users.id, requestor.id));
    }
  } catch (e) {
    throw new Error('club has NOT been saved');
  }
  redirect(`/clubs/${id}`);
};
