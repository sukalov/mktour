'use client'

import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'
import { Button } from './ui/button'
import lichessLogo from './ui/lichess-logo'
import Mktour from './mktour-logo'

export default function AuthButton() {
	const { data: session, status, update } = useSession()
  const logoLichess = React.createElement(lichessLogo)
  const loading = status === 'loading'

	const handleSignOut = () => {
		signOut({ callbackUrl: '/' })
	}
  if (loading) return <Mktour />
  // if (loading) return null

	// if (loading) {
	// 	return (
	// 		<div>
	// 			<Button variant="outline">Loading...</Button>
	// 		</div>
	// 	)
	// }

	if (!session) {
		return (
			<div>
				<SessionProvider>
					<Button className='flex-row gap-4 p-2' variant="outline" onClick={() => signIn('lichess')}>
						{logoLichess} Sign in with Lichess
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
