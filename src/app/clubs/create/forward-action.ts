'use server';

import selectClub from '@/server/mutations/club-select';
import { redirect } from 'next/navigation';

export const forwardAction = async ({
  clubId,
  userId,
}: {
  clubId: string;
  userId: string;
}) => {
  await selectClub({ clubId, userId });
  redirect('/clubs/my');
};
