'use client'

import { SessionProvider } from 'next-auth/react'
import NavbarDesktop from './navbarDesktop'
import { useMediaQuery } from 'react-responsive'
import NavbarMobile from './navbarMobile'

export default function NavbarWrapper() {
	const isMobile = useMediaQuery({ maxWidth: 500 })
	const Page = isMobile ? NavbarMobile : NavbarDesktop

	return (
		<SessionProvider>
			<Page />
		</SessionProvider>
	)
}
