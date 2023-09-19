'use client'

import { Menu } from 'lucide-react'
import { SessionProvider, useSession } from 'next-auth/react'
import Link from 'next/link'
import AuthButton from './auth-button'
import MktourNavbar from './ui/mktour-logo-navbar'

export default function NavbarMobile() {
	const { data: session, status, update } = useSession()
	const loading = status === 'loading'

	if (loading) return null
	return (
		<SessionProvider>
			<nav className='flex w-full border-b items-center justify-end p-4 fixed gap-3'>
				<Menu />
				<Link href='/'>
					<div className='p-2 select-none'>
						<MktourNavbar />
					</div>
				</Link>
				<div className='flex-grow'></div>
				<AuthButton session={session} />
			</nav>
		</SessionProvider>
	)
}
