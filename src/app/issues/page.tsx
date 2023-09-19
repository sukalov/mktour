'use client'

import AuthButton from '@/components/auth-button'
import { SessionProvider } from 'next-auth/react'

export default function Issues() {
	return (
		<main className='flex min-h-screen flex-col items-center justify-around p-24'>
			<SessionProvider>
				<div className='text-red-500'>issues</div>
			</SessionProvider>
		</main>
	)
}
