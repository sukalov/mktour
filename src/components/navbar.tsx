'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import AuthButton from './auth-button'
import ModeToggler from './mode-toggler'
import Link from 'next/link'
import { Button } from './ui/button'
import ButtonForAuthorized from './button-for-authorized'
import MktourNavbar from './ui/mktour-logo-navbar'
import { useEffect } from 'react'

export default function Navbar() {
	const { data: session, status, update } = useSession()
	const loading = status === 'loading'

	if (loading) return null
	return (
		<SessionProvider>
			<nav className="flex w-full border-b justify-end p-4 fixed gap-3">
				<Link href="/">
					<div className="p-2">
						<MktourNavbar />
					</div>
				</Link>
				<ButtonForAuthorized text="issues" variant="outline" slug="issues" />
				<div className="flex-grow"></div>
				<AuthButton session={session} />
				<ModeToggler />
			</nav>
		</SessionProvider>
	)
}
