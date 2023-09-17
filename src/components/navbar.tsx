'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import AuthButton from './auth-button'
import ModeToggler from './mode-toggler'
import Link from 'next/link'
import { Button } from './ui/button'
import ButtonForAuthorized from './button-for-authorized'

export default function Navbar() {
  const { data: session, status, update } = useSession()
  const loading = status === 'loading'
  
  if (loading) return null
	return (
		<SessionProvider>
			<nav className="flex w-full border-b justify-end p-4 fixed gap-3">
				<Link href="/">
					<Button variant="outline">mktour_</Button>
				</Link>
				<ButtonForAuthorized text="issues" variant="outline" slug="issues" />
				<div className="flex-grow"></div>
				<ModeToggler />
			</nav>
		</SessionProvider>
	)
}
