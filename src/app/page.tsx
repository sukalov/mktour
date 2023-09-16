'use client'

import ModeToggler from '@/components/mode-toggler'
import Mktour from '@/components/mktour-logo'
import AuthButton from '@/components/auth-button'
import { SessionProvider } from 'next-auth/react'

const Home = () => {
	return (
		<SessionProvider>
			<main className="flex min-h-screen flex-col items-center justify-around p-12">
				<Mktour />
			</main>
		</SessionProvider>
	)
}

export default Home
