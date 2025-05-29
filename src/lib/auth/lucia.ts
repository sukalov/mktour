import { BASE_URL } from '@/lib/config/urls';
import { adapter } from '@/server/db/lucia-adapter';

import type { DatabaseUser } from '@/server/db/schema/users';
import { Lichess } from 'arctic';
import type { Session, User } from 'lucia';
import { Lucia } from 'lucia';
import { cacheLife } from 'next/dist/server/use-cache/cache-life';
import { cookies } from 'next/headers';
import { cache } from 'react';

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes: Omit<DatabaseUser, 'id'>) => {
    return {
      username: attributes.username,
      name: attributes.name,
      email: attributes.email,
      rating: attributes.rating,
      selected_club: attributes.selected_club,
      created_at: attributes.created_at,
    };
  },
});

declare module 'lucia' {
  export interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<DatabaseUser, 'id'>;
  }
}

export const uncachedValidateRequest = async (): Promise<
  { user: User; session: Session } | { user: null; session: null }
> => {
  const cooks = await cookies();
  const sessionId = cooks.get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  let result;
  do {
    try {
      result = await lucia.validateSession(sessionId);
    } catch (e) {
      console.log(e);
    }
  } while (!result);
  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cooks.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cooks.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {}
  return result;
};

export const reactCachedValidateRequest = cache(uncachedValidateRequest);

export const validateRequest = cache(async () => {
  const cooks = await cookies();
  const sessionId = cooks.get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  let result;
  do {
    try {
      result = await cachedValidateSession(sessionId);
    } catch (e) {
      console.log(e);
    }
  } while (!result);
  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cooks.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cooks.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {}
  return result;
});

const cachedValidateSession = async (sessionId: string) => {
  'use cache';
  cacheLife({
    stale: 1000 * 60 * 60,
    revalidate: 1000 * 60 * 60,
  });
  return await lucia.validateSession(sessionId);
};

export const lichess = new Lichess(
  process.env.LICHESS_CLIENT_ID ?? '',
  `${BASE_URL}/login/lichess/callback`,
);
