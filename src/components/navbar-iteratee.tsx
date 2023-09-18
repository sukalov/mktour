'use client'

import { SessionProvider } from 'next-auth/react'
import Navbar from './navbar'
import { useMediaQuery } from 'react-responsive'
import NavbarMobile from './navbarMobile'

export default function NavbarIteratee() {
  const isMobile = useMediaQuery({ maxWidth: 500 })
  const Page = isMobile ? NavbarMobile : Navbar

	return (
		<SessionProvider>
			<Page />
		</SessionProvider>
	)
}
