import { Lucia } from "lucia";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { cache } from "react";
import { Lichess } from "@/lib/auth/lichess-provider";
import type { Session, User } from "lucia";
import type { DatabaseUser } from "@/lib/db/schema/auth";
import { adapter } from "@/lib/db/lucia-adapter";
import { BASE_URL } from "@/config/env";

// import { webcrypto } from "crypto";
// globalThis.crypto = webcrypto as Crypto;


export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: process.env.NODE_ENV === "production"
		}
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username
		};
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: Omit<DatabaseUser, "id">;
	}
}

export const validateRequest = cache(
	async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
		const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
		if (!sessionId) {
			return {
				user: null,
				session: null
			};
		}

		const result = await lucia.validateSession(sessionId);
		// next.js throws when you attempt to set cookie when rendering page
		try {
			if (result.session && result.session.fresh) {
				const sessionCookie = lucia.createSessionCookie(result.session.id);
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
		} catch {}
		return result;
	}
);

export const lichess = new Lichess(process.env.GITHUB_CLIENT_ID!, process.env.GITHUB_CLIENT_SECRET!, {
	redirectURI: `${BASE_URL}/login/lichess/callback`,
	scopes: ['email:read']
});