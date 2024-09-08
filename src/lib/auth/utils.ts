'use server';

import { validateRequest } from '@/lib/auth/lucia';
import { User } from 'lucia';

export type AuthSession = {
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
      username: string;
    };
  } | null;
};

export async function getUser(): Promise<User | undefined> {
  const { user } = await validateRequest();
  if (!user) return undefined;
  return user;
}
