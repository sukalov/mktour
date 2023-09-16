'use client'

import { SessionProvider } from 'next-auth/react'
import AuthButton from './auth-button'
import ModeToggler from './mode-toggler'
import Link from 'next/link'
import { Button } from './ui/button'
import ButtonForAuthorized from './button-for-authorized'

export default function Navbar() {
	return (
		<SessionProvider>
			<nav className="flex w-full border justify-end p-4 fixed gap-3">
				<Link href="/">
					<Button variant="outline">mktour_</Button>
				</Link>
				<ButtonForAuthorized text="issues" variant="outline" slug="issues" />
				<div className="flex-grow"></div>
				<AuthButton />
				<ModeToggler />
			</nav>
		</SessionProvider>
	)
}
