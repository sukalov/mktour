// import { lucia } from 'lucia';
// import { nextjs_future } from 'lucia/middleware';
// import { cache } from 'react';
// import * as context from 'next/headers';
// import { libsql } from '@lucia-auth/adapter-sqlite';
// import { sqlite } from '@/lib/db/index';
// import { lichess } from '@lucia-auth/oauth/providers';
// import { BASE_URL } from '@/config/env';

// export const auth = lucia({
//   adapter: libsql(sqlite, {
//     user: 'user',
//     key: 'user_key',
//     session: 'user_session',
//   }),
//   env: 'DEV',
//   middleware: nextjs_future(),
//   sessionCookie: { expires: false },
//   getUserAttributes: (data) => {
//     return {
//       username: data.username,
//       email: data.email,
//       name: data.name,
//       lichess_blitz: data.lichess_blitz,
//     };
//   },
// });

// export const lichessAuth = lichess(auth, {
//   clientId: process.env.LICHESS_CLIENT_ID ?? '',
//   redirectUri: `${BASE_URL}/login/lichess/callback`,
//   scope: ['email:read'],
// });

// export type Auth = typeof auth;

// export const getPageSession = cache(() => {
//   const authRequest = auth.handleRequest('GET', context);
//   return authRequest.validate();
// });
