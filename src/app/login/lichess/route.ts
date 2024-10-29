'use server';

import { lichess } from '@/lib/auth/lucia';
import { generateCodeVerifier, generateState } from 'arctic';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest): Promise<Response> {
  console.log(request.nextUrl.searchParams);
  const from = request.nextUrl.searchParams.get('from');
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = await lichess.createAuthorizationURL(state, codeVerifier, {
    scopes: ['email:read', 'team:write'],
  });

  (await cookies())
    .getAll()
    .forEach(async cookie => {
      if (cookie.name !== 'NEXT_LOCALE') (await cookies()).delete(cookie.name);
    });

  if (from) {
    (await cookies()).set('auth_from', from, {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  (await cookies()).set('lichess_oauth_state', state, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  });
  (await cookies()).set('lichess_oauth_code_validation', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });

  return Response.redirect(url);
}
