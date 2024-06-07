'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema/auth';
import { EditProfileFormType } from '@/lib/zod/edit-profile-form';
import { eq } from 'drizzle-orm';

export const editUser = async ({id, ...values}: EditProfileFormType) => {
  await db.update(users).set(values).where(eq(users.id, id));
};
