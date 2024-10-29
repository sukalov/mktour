'use server';

import { lichess, lucia } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import { DatabaseUser, user_preferences, users } from '@/lib/db/schema/auth';
import { clubs, clubs_to_users } from '@/lib/db/schema/tournaments';
import { newid } from '@/lib/utils';
import { LichessUser } from '@/types/lichess-api';
import { OAuth2RequestError } from 'arctic';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const authFrom = (await cookies()).get('auth_from')?.value ?? null;
  (await cookies()).delete('auth_from');
  const storedState = (await cookies()).get('lichess_oauth_state')?.value ?? null;
  const codeVerifier = (await cookies()).get('lichess_oauth_code_validation')?.value;

  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !codeVerifier
  ) {
    return new Response(
      "code or state don't match stored to those stored in cookies",
      {
        status: 400,
      },
    );
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

    (await cookies()).set('token', tokens.accessToken, {
      sameSite: 'none',
      secure: true,
    });

    const existingUser = (
      await db.select().from(users).where(eq(users.username, lichessUser.id))
    ).at(0) as DatabaseUser | undefined;

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      (await cookies()).set(sessionCookie.name, sessionCookie.value, {
        ...sessionCookie.attributes,
      });
      return new Response(null, {
        status: 302,
        headers: {
          Location: authFrom ? authFrom : '/',
        },
      });
    }

    try {
      const userId = newid();
      const clubId = newid();
      const ctuId = `${clubId}=${userId}`;
      const name = `${lichessUser.profile?.realName}`;

      await db.insert(clubs).values({
        id: clubId,
        name: `${lichessUser.id}'s chess club`,
        created_at: new Date(),
      });

      await db.insert(users).values({
        id: userId,
        rating: lichessUser.perfs.blitz.rating,
        username: lichessUser.id,
        email: lichessUserEmail,
        name,
        selected_club: clubId,
        created_at: new Date(),
      });

      await db.insert(clubs_to_users).values({
        id: ctuId,
        club_id: clubId,
        user_id: userId,
        status: 'admin',
      });
      await db.insert(user_preferences).values({
        user_id: userId,
        language: 'en',
      });

      (await cookies()).set('show_new_user_toast', 'true');

      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      (await cookies()).set(sessionCookie.name, sessionCookie.value, {
        ...sessionCookie.attributes,
      });
    } catch (e) {
      console.log(e);
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: authFrom ? authFrom : '/',
      },
    });
  } catch (e) {
    if (
      e instanceof OAuth2RequestError &&
      e.message === 'bad_verification_code'
    ) {
      return new Response(JSON.stringify(e), {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}
