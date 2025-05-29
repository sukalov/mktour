'use server';

import { lichess } from '@/lib/auth/lucia';
import { generateCodeVerifier, generateState } from 'arctic';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest): Promise<Response> {
  const from = request.nextUrl.searchParams.get('from');
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = lichess.createAuthorizationURL(state, codeVerifier, [
    'email:read',
    'team:write',
  ]);

  const cooks = await cookies();

  cooks.getAll().forEach((cookie) => {
    if (cookie.name !== 'NEXT_LOCALE') cooks.delete(cookie.name);
  });

  if (from) {
    cooks.set('auth_from', from, {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  cooks.set('lichess_oauth_state', state, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  });
  cooks.set('lichess_oauth_code_validation', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });

  return Response.redirect(url);
}
