'use client'

import NavbarIteratee from '@/components/navbar-iteratee'
import { SessionProvider } from 'next-auth/react'
import { useMediaQuery } from 'react-responsive'
import HomeDesktop from './desktop'
import HomeMobile from './mobile'

export default function Home() {
	const isMobile = useMediaQuery({ maxWidth: 500 })
	const Page = isMobile ? HomeMobile : HomeDesktop

	return (
		<SessionProvider>
			<NavbarIteratee />
			<main className="flex min-h-screen flex-col items-center justify-around p-12">
				<Page />
			</main>
		</SessionProvider>
	)
}
