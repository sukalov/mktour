'use client'

import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'
import { Button } from './ui/button'
import LichessLogo from './ui/lichess-logo'

export default function AuthButton() {
	const { data: session, status, update } = useSession()
  const logo = React.createElement(LichessLogo)

	const handleSignOut = () => {
		signOut({ callbackUrl: '/' })
	}

	if (!session) {
		return (
			<div>
				<SessionProvider>
					<Button className='flex-row gap-4 p-2' variant="outline" onClick={() => signIn('lichess')}>
						{logo} Sign in with Lichess
					</Button>
				</SessionProvider>
			</div>
		)
	}

	return (
		<div>
			<Button variant="outline" onClick={handleSignOut}>
				Sign out as {session.user?.name}
			</Button>
		</div>
	)
}
