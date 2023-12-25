'use client'

import AuthButton from '@/components/auth-button'
import { Button } from '@/components/ui/button'
import LichessLogo from '@/components/ui/lichess-logo'
import Mktour from '@/components/ui/mktour-logo'
import { signIn, useSession } from 'next-auth/react'

export default function HomeMobile() {
	const { data: session, status, update } = useSession()
	const loading = status === 'loading'

	if (loading) return <Mktour />
	return (
		<div className='w-full h-full flex-col gap-7 flex'>
			<Button
				className='flex flex-col gap-2 w-full h-auto min-h-24 font-bold'
				variant='default'
			>
				<h1 className=' text-3xl font-light'>make tournament</h1>
				<p className='font-extralight'>
					{!session && `(sign in to save your tournaments' results)`}
				</p>
			</Button>
			{!session && 
			<Button 
			className='flex flex-col gap-2 w-full h-auto min-h-24 font-bold'
			variant='secondary'
			onClick={() => signIn('lichess', {redirect: false})}>
				<div className=' grid-flow-col'></div>
				<span className=' grid-col-3'><LichessLogo size='48'/></span>
				<span className='font-light text-xl grid-col--9'>sign in with lichess</span>
		    </Button>}
		</div>
	)
}
