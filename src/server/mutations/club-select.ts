'use server';

import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/server/db';
import { users } from '@/server/db/schema/users';
import { eq } from 'drizzle-orm';

const selectClub = async ({
  clubId,
  userId,
}: {
  clubId: string;
  userId: string;
}) => {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  if (user.id !== userId) throw new Error('USER_NOT_MATCHING');
  return await db
    .update(users)
    .set({ selected_club: clubId })
    .where(eq(users.id, userId));
};

export default selectClub;
