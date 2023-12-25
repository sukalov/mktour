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
		<div className='w-full p-1 flex flex-col gap-7'>
			{!session && <div className="text-5xl pt-16 font-bold w-full pb-24 text-start m-auto max-w-[28rem]">all chess tournaments in one place</div>}
		<div className="flex-grow"></div>
			<Button
				className='flex flex-col gap-2 w-full h-auto min-h-24 font-bold max-w-[28rem] m-auto'
				variant='default'
			>
				<h1 className=' text-3xl font-light'>make tournament</h1>
				<p className='font-extralight'>
					{!session && `(sign in to save your tournaments' results)`}
				</p>
			</Button>
			{!session && 
			<Button 
			className='flex flex-col gap-2 w-full h-auto min-h-24 font-bold max-w-[28rem] m-auto'
			variant='secondary'
			onClick={() => signIn('lichess', {redirect: false})}>
				<div className=' grid-flow-col'></div>
				<span className=' grid-col-3'><LichessLogo size='48'/></span>
				<span className='font-light text-xl grid-col--9'>sign in with lichess</span>
		    </Button>}
		</div>	)
}
