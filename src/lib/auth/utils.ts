import { validateRequest } from '@/lib/auth/lucia';
import { User } from 'lucia';
import { redirect } from 'next/navigation';

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

export async function getUser (): Promise<User | null> {
  const { user } = await validateRequest();
  if (!user) redirect('/sign-in');
  return user
};

export function timeout(ms: number) {
  console.log(ms);
  return new Promise((resolve) => setTimeout(resolve, ms));
}
