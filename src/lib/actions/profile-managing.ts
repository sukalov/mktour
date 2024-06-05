'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema/auth';
import { EditProfileFormType } from '@/lib/zod/edit-profile-form';

export const editUser = async (values: EditProfileFormType) => {
  await db.update(users).set(values);
};
