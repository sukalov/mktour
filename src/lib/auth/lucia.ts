import { BASE_URL } from '@/lib/config/urls';
import { adapter } from '@/lib/db/lucia-adapter';

import type { DatabaseUser } from '@/lib/db/schema/users';
import { Lichess } from 'arctic';
import type { Session, User } from 'lucia';
import { Lucia } from 'lucia';
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

export const validateRequest = cache(
  async (): Promise<
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
  },
);

export const lichess = new Lichess(
  process.env.LICHESS_CLIENT_ID!,
  `${BASE_URL}/login/lichess/callback`,
);
