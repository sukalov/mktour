'use server';

import { cookies } from 'next/headers';
import { encrypt } from './encrypt-decrypt';

export const getEncryptedAuthSession = async (): Promise<
  string | undefined
> => {
  const session = (await cookies()).get('auth_session')?.value;
  if (!session) return undefined;
  return encrypt(session);
};
