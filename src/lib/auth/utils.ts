import { validateRequest } from '@/lib/auth/lucia';
import { redirect } from 'next/navigation';
import { cache } from 'react';

export type AuthSession = {
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
      username?: string;
    };
  } | null;
};

export const checkAuth = async () => {
  const { user } = await validateRequest();
  if (!user) redirect('/sign-in');
};
