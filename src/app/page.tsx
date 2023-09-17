'use client'

import Navbar from '@/components/navbar'
import { SessionProvider } from 'next-auth/react'
import HomeMobile from './mobile'

const Home = () => {
	return (
		<SessionProvider>
			<main className="flex min-h-screen flex-col items-center justify-around p-12">
			<HomeMobile />
      </main>
		</SessionProvider>
	)
}

export default Home
