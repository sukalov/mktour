'use server';

import selectClub from '@/server/mutations/club-select';
import { redirect } from 'next/navigation';

export const forwardAction = async ({ clubId }: { clubId: string }) => {
  await selectClub({ clubId });
  redirect('/clubs/my');
};
