import type { NextAuthOptions } from 'next-auth'
import LichessProvider from '@/lib/LichessProvider'

export const options: NextAuthOptions = {
	providers: [
		LichessProvider({
			clientId: 'mktour.org',
			clientSecret: process.env.LICHESS_CLIENT_SECRET,
		}),
	],
}
