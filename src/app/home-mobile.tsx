'use client'

import AuthButton from '@/components/auth-button'
import { MenuSideBar } from '@/components/menu-bar'
import { Button } from '@/components/ui/button'
import Mktour from '@/components/ui/mktour-logo'
import { useSession } from 'next-auth/react'

export default function HomeMobile() {
	const { data: session, status, update } = useSession()
	const loading = status === 'loading'

	if (loading) return <Mktour />
	return (
		<div className='w-full h-full flex-col gap-7 flex'>
			<Button
				className='flex flex-col gap-2 w-full h-24 bg-[hsl(var(--primary))] text-[hsl(var(--secondary))] font-bold'
				variant='outline'
			>
				<h1>Make tournament</h1>
				<>{!session && `(sign up to save your tournaments' results)`}</>
			</Button>
			{!session && <AuthButton session={session} />}
		</div>
	)
}
