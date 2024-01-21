import { lichess } from '@/lib/auth/lucia';
import { generateState } from "arctic";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
	const state = generateState();
	const url = await lichess.createAuthorizationURL(state);

	cookies().set("lichess_oauth_state", state, {
		path: "/",
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		sameSite: "lax"
	});
  cookies().set('lichess_oauth_code_validation', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });

	return Response.redirect(url);
}
