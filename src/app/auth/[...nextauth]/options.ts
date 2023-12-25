import type { NextAuthOptions, Session } from 'next-auth'
import LichessProvider from '@/lib/LichessProvider'
import type { JWT } from 'next-auth/jwt'
import { AdapterUser } from 'next-auth/adapters'

interface MySessionProps {
	session: Session
	token: JWT
	user: AdapterUser
}

export const options: NextAuthOptions = {
	callbacks: {
		async session({ session, token, user }: MySessionProps) {
			session.user.username = token.sub as string
			return session
		},
	},
	providers: [
		LichessProvider({
			clientId: 'mktour.org',
			clientSecret: process.env.LICHESS_CLIENT_SECRET,
		}),
	],
	pages: {
		signIn: 'auth/sign-in',
		error: 'auth/error'
	}
}
