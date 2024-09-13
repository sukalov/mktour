'use server';

import selectClub from '@/lib/actions/club-select';
import { redirect } from 'next/navigation';

export const forwardAction = async ({
  clubId,
  userId,
}: {
  clubId: string;
  userId: string;
}) => {
  await selectClub({ clubId, userId });
  redirect('/club/dashboard');
};
