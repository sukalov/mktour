'use client'

import { SessionProvider } from 'next-auth/react'
import Navbar from './navbar'

export default function NavbarIteratee() {
	return (
		<SessionProvider>
			<Navbar />
		</SessionProvider>
	)
}
