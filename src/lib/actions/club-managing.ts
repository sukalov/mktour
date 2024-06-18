'use server';

import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema/auth';
import {
  DatabaseClub,
  DatabaseClubsToUsers,
  clubs,
  clubs_to_users,
} from '@/lib/db/schema/tournaments';
import { newid } from '@/lib/utils';
import { NewClubFormType } from '@/lib/zod/new-club-form';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export const createClub = async (values: NewClubFormType) => {
  const { user } = await validateRequest();
  if (!user) throw new Error('unauthorized request');
  const id = newid();
  const newClub = {
    ...values,
    id,
  };
  const newRelation: DatabaseClubsToUsers = {
    id: `${user.id}=${id}`,
    club_id: id,
    user_id: user.id,
    status: 'admin',
  };
  try {
    await db.insert(clubs).values(newClub);
    await db.insert(clubs_to_users).values(newRelation);
    await db
      .update(users)
      .set({ selected_club: id })
      .where(eq(users.id, user.id));
  } catch (e) {
    throw new Error('club has NOT been saved');
  }
  redirect('/club/dashboard');
};

export const getClubInfo = async (id: DatabaseClub['id']) => {
  return (await db.select().from(clubs).where(eq(clubs.id, id)))?.at(0);
};
