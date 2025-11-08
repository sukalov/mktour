'use server';

import { cookies } from 'next/headers';
import { encrypt } from './encrypt-decrypt';

export const getEncryptedAuthSession = async (): Promise<string> => {
  const session = (await cookies()).get('auth_session')?.value;
  if (!session) return '';
  return encrypt(session);
};
