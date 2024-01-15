// import { Provider } from 'next-auth/providers';

// export default function LichessProvider(options: any): Provider {
//   return {
//     id: 'lichess',
//     name: 'Lichess',
//     type: 'oauth',
//     version: '2.0',
//     authorization: {
//       url: 'https://lichess.org/oauth/',
//       params: {
//         scope: 'email:read',
//       },
//     },
//     token: {
//       url: 'https://lichess.org/api/token',

//       async request({ client, params, checks, provider }) {
//         const response = await client.oauthCallback(
//           provider.callbackUrl,
//           params,
//           checks,
//           {
//             exchangeBody: {
//               client_id: options.clientId,
//             },
//           },
//         );
//         return {
//           tokens: response,
//         };
//       },
//     },
//     userinfo: {
//       url: 'https://lichess.org/api/account',
//       params: {
//         scope: 'email:read',
//       },
//     },

//     profile(data: any) {
//       return {
//         id: data.id,
//         username: data.username,
//         name: `${data.profile.firstName} ${data.profile.lastName}`,
//       };
//     },

//     checks: ['pkce', 'state'],
//     options,
//   };
// }
