'use server';

import { clubQueryClient } from '@/app/club/dashboard/prefetch';
import selectClub from '@/lib/actions/club-select';
import { getUser } from '@/lib/auth/utils';
import { revalidatePath } from 'next/cache';

export const changeClub = async (id: string) => {
  const user = await clubQueryClient.fetchQuery({
    queryKey: ['user'],
    queryFn: getUser,
  });
  if (!user) throw new Error('no user in server action');
  await selectClub({ clubId: id, userId: user.id });
  clubQueryClient.invalidateQueries({ queryKey: ['user'] });
  revalidatePath('/club/dashboard');
};
