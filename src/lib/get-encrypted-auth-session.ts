'use server';

import { cookies } from 'next/headers';
import { encrypt } from './encrypt-decrypt';

export const getEncryptedAuthSession = async (): Promise<string | null> => {
  const session = (await cookies()).get('auth_session')?.value;
  if (!session) return null;
  return encrypt(session);
};
