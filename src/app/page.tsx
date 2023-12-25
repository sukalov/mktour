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
			<main className='flex min-h-screen flex-col items-center justify-around p-12'>
				<Page />
			</main>
		</SessionProvider>
	)
}
