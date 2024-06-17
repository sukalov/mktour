'use server';

import { db } from '@/lib/db';
import { DatabaseUser, users } from '@/lib/db/schema/auth';
import { eq } from 'drizzle-orm';

export const editUser = async ({ id, values }: UpdateDatabaseUser) => {
  await db.update(users).set(values).where(eq(users.id, id));
};

type UpdateDatabaseUser = {
  id: string;
  values: Partial<DatabaseUser>
};
