'use server';

import { validateRequest } from '@/lib/auth/lucia';
import { User } from 'lucia';

export async function getUser(): Promise<User | undefined> {
  const { user } = await validateRequest();
  if (!user) return undefined;
  return user;
}
