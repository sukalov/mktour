'use client'

import { Button } from './ui/button'
import { options } from '@/app/api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { useEffect } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { SessionProvider } from 'next-auth/react'

export default function AuthButton() {
	const { data: session, status, update } = useSession()
	console.log(session, status)

	const handleSignIn = () => {
		signIn(undefined, { callbackUrl: '/' })
	}

	const handleSignOut = () => {
		signOut({ callbackUrl: '/' })
	}

	if (status === 'loading') {
		return (
			<div>
				<Button variant="outline">Loading...</Button>
			</div>
		)
	}

	if (!session) {
		return (
			<div>
				<SessionProvider>
					<Button variant="outline" onClick={() => signIn('lichess')}>
						Sign in with Lichess
					</Button>
				</SessionProvider>
			</div>
		)
	}

	return (
		<div>
			<Button variant="outline" onClick={handleSignOut}>
				Sign out from {session.user?.name}
			</Button>
		</div>
	)
}
