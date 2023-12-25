'use client'

import { SessionProvider } from 'next-auth/react'
import { useMediaQuery } from 'react-responsive'
import HomeDesktop from './home-desktop'
import HomeMobile from './home-mobile'

export default function Home() {
	const isMobile = useMediaQuery({ maxWidth: 700 })
	const Page = isMobile ? HomeMobile : HomeDesktop

	return (
		<SessionProvider>
			<main className='min-h-screen flex flex-col gap-3 justify-center'>
				<Page />
			</main>
		</SessionProvider>
	)
}
