'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import AuthButton from './auth-button'
import { MenuSideBar } from './menu-bar'
import MktourNavbar from './ui/mktour-logo-navbar'

export default function NavbarMobile() {
	const { data: session, status, update } = useSession()
	const loading = status === 'loading'
  
	if (loading) return null
	return (
		<nav className='bg-[hsl(var(--primary))] text-[hsl(var(--secondary))] flex min-w-max w-full border-b items-center justify-end p-4 fixed gap-3'>
			<MenuSideBar session={session} />
			<Link href='/'>
				<div className='p-2 select-none'>
					<MktourNavbar />
				</div>
			</Link>
			<div className='flex-grow'></div>
			{session && <AuthButton session={session} />}
		</nav>
	)
}
