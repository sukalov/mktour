import { logout } from '@/lib/actions/logout';
import { lucia } from '@/lib/auth/lucia';
import * as context from 'next/headers';

import type { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  await logout()
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/sign-in', // redirect to login page
    },
  });
};
