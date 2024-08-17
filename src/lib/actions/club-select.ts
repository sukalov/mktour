'use server';

import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema/auth';
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
    await db
      .update(users)
      .set({ selected_club: clubId })
      .where(eq(users.id, userId));
};

export default selectClub;
