import type { NextAuthOptions } from "next-auth";
import LichessProvider from "@/lib/LichessProvider";

export const options: NextAuthOptions = {
    providers: [
        LichessProvider({
            clientId: 'jjhh',
            clientSecret: 'dfiuwef'
        }),
        {
            id: "lichess2",
            name: "Lichess2",
            type: "oauth",
            version: "2.0",
            clientId: 'client-id-test',
            clientSecret: 'secret',
            authorization: {
              url: `https://lichess.org/oauth`,
              params: { client_id: 'client-id-test', scope: 'email:read', code_challenge_method: 'S256' },
            },
            token: `https://lichess.org/api/token`,
            userinfo: `https://lichess.org/api/account`,
            checks: ["pkce", "state"],
            profile(profile) {
              return {
                id: profile.id,
                username: profile.username,
              };
            },
          },
    ],
}