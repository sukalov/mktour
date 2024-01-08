'use client'

import { SessionProvider } from 'next-auth/react'
import { createContext } from 'react'
import Navbar from './navbar'

export const WidthContext = createContext(true)

export default function NavbarWrapper() {
	return (
			<SessionProvider>
				<Navbar />
			</SessionProvider>
	)
}
