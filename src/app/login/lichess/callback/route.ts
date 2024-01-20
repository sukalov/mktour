import { auth, lichessAuth } from '@/lib/auth/lucia';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { cookies, headers } from 'next/headers';
import { validateOAuth2AuthorizationCode } from '@lucia-auth/oauth';

import type { NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  const storedState = cookies().get('lichess_oauth_state')?.value;
  const codeValidation = cookies().get('lichess_oauth_code_validation')!.value;
  const url = new URL(request.url);
  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');
  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, {
      status: 400,
    });
  }
  try {
    const { getExistingUser, lichessUser, createUser, lichessTokens } =
      await lichessAuth.validateCallback(code, codeValidation);
    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;
      const emailRes = await fetch('https://lichess.org/api/account/email', {
        headers: {
          Authorization: `Bearer ${lichessTokens.accessToken}`,
        },
      });
      const email = (await emailRes.json())!.email;
      const user = await createUser({
        attributes: {
          username: lichessUser.username,
          // @ts-expect-error
          name: `${lichessUser.profile.firstName} ${lichessUser.profile.lastName}`,
		  email,
		  // @ts-expect-error
		  lichess_blitz: lichessUser.perfs.blitz.rating
        },
      });
      return user;
    };

    const user = await getUser();
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest(request.method, {
      cookies,
      headers,
    });
    authRequest.setSession(session);
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/', // redirect to profile page
      },
    });
  } catch (e) {
    if (e instanceof OAuthRequestError) {
      // invalid code
      console.log('=OAuthRequestError=', e);
      return new Response(JSON.stringify(e), {
        status: 400,
      });
    }
    console.log(e);
    return new Response(JSON.stringify(e), {
      status: 500,
    });
  }
};
