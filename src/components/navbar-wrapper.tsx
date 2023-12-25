'use client'

import { SessionProvider } from 'next-auth/react'
import { createContext } from 'react'
import { useMediaQuery } from 'react-responsive'
import NavbarDesktop from './navbar-desktop'
import NavbarMobile from './navbar-mobile'

export const WidthContext = createContext(true)

export default function NavbarWrapper() {
	const isMobile = useMediaQuery({ maxWidth: 700 })
	const Page = isMobile ? NavbarMobile : NavbarDesktop

	return (
		<WidthContext.Provider value={isMobile}>
			<SessionProvider>
				<Page />
			</SessionProvider>
		</WidthContext.Provider>
	)
}
