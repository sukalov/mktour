import { lichess, lucia } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { OAuth2RequestError } from 'arctic';
import { generateId } from 'lucia';

import { DatabaseUser, users } from '@/lib/db/schema/auth';
import { LichessUser } from '@/types/lichess-api';
import { eq } from 'drizzle-orm';
import { redis } from '@/lib/db/redis';

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookies().get('lichess_oauth_state')?.value ?? null;
  const codeVerifier = cookies().get('lichess_oauth_code_validation')?.value;

  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !codeVerifier
  ) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await lichess.validateAuthorizationCode(code, codeVerifier);
    const lichessUserResponse = await fetch('https://lichess.org/api/account', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const lichessUserEmailResponse = await fetch(
      'https://lichess.org/api/account/email',
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );
    const lichessUser: LichessUser = await lichessUserResponse.json();
    const lichessUserEmail = (await lichessUserEmailResponse.json())
      .email as string;

    cookies().set('token', tokens.accessToken);

    const existingUser = (
      await db.select().from(users).where(eq(users.username, lichessUser.id))
    ).at(0) as DatabaseUser | undefined;

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/',
        },
      });
    }

    fetch('https://lichess.org/team/mktour/join', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const userId = generateId(15);
    const name = `${lichessUser.profile.firstName ?? ''}${lichessUser.profile.lastName ? ' ' + lichessUser.profile.lastName : ''}`;
    await db.insert(users).values({
      id: userId,
      lichess_blitz: lichessUser.perfs.blitz.rating,
      username: lichessUser.id,
      email: lichessUserEmail,
      name,
    });
    await redis.set(userId, true);

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
      },
    });
  } catch (e) {
    if (
      e instanceof OAuth2RequestError &&
      e.message === 'bad_verification_code'
    ) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}
