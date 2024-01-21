import { lichessAuth } from '@/lib/auth/lucia';
import * as context from 'next/headers';

import type { NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  const [url, state] = await lichessAuth.getAuthorizationUrl();
  context
    .cookies()
    .set('lichess_oauth_state', String(url.searchParams.get('state')), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax'
    });
  context.cookies().set('lichess_oauth_code_validation', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax'
  });
  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
};
