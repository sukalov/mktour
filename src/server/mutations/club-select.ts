'use server';

import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/server/db';
import { users } from '@/server/db/schema/users';
import { eq } from 'drizzle-orm';

const selectClub = async ({ clubId }: { clubId: string }) => {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  return await db
    .update(users)
    .set({ selected_club: clubId })
    .where(eq(users.id, user.id))
    .returning({ selected_club: users.selected_club })
    .get();
};

export default selectClub;
