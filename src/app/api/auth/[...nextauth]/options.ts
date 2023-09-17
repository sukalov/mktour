import type { NextAuthOptions, Session } from 'next-auth'
import LichessProvider from '@/lib/LichessProvider'
import type { JWT } from 'next-auth/jwt'
import { AdapterUser } from 'next-auth/adapters'


interface SessionProps {
    session: Session,
    token: JWT
    user: AdapterUser

}

export const options: NextAuthOptions = {
    callbacks: {
        async session({ session, token, user }: SessionProps) {
        //   session!.accessToken = token.accessToken
        //   session.user.id = token.id  ДОДЕЛАТЬ
          
          return session
        }
      },
	providers: [
		LichessProvider({
			clientId: 'mktour.org',
			clientSecret: process.env.LICHESS_CLIENT_SECRET,
		}),
	],
}
