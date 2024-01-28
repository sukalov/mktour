import { logout } from '@/lib/actions/logout';

import type { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  await logout();
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/sign-in', // redirect to login page
    },
  });
};
