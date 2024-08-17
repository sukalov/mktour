'use server';

import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import { DatabaseUser, users } from '@/lib/db/schema/auth';
import { eq } from 'drizzle-orm';

export const editUser = async ({ id, values }: UpdateDatabaseUser) => {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  if (user.id !== id) throw new Error('USER_NOT_MATCHING');
  await db.update(users).set(values).where(eq(users.id, id));
};

type UpdateDatabaseUser = {
  id: string;
  values: Partial<DatabaseUser>;
};
