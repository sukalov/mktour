import { Button } from '@/components/ui/button'
import LichessLogo from '@/components/ui/lichess-logo'
import Mktour from '@/components/ui/mktour-logo'
import { signIn, useSession } from 'next-auth/react'

export default function HomeMobile() {
	const { data: session, status, update } = useSession()
	const loading = status === 'loading'

	if (loading) return <Mktour />
	
	return (
		<div className='w-full mt-16 h-[calc(100svh-4rem)] p-1 flex flex-col gap-7'>
			{!session && (
				<div className='text-[3.5rem] leading-none grow font-extrabold w-full m-auto max-w-[37rem] text-balance flex flex-auto items-center'>
					<p>chess events has become simple for everyone</p>
				</div>
			)}
			{!session && (
				<Button
					className='flex flex-col flex-none gap-2 w-full h-auto min-h-24 font-bold max-w-[28rem] m-auto'
					variant='outline'
					onClick={() => signIn('lichess', { redirect: false })}
				>
					<div className=' grid-flow-col'></div>
					<span className=' grid-col-3'>
						<LichessLogo size='48' />
					</span>
					<span className='font-light text-xl grid-col--9'>sign in with lichess</span>
				</Button>
			)}
			<Button
				className='flex flex-col gap-2 w-full h-auto min-h-24 font-bold max-w-[28rem] m-auto'
				variant='default'
			>
				<h1 className=' text-3xl font-light'>make tournament</h1>
				<p className='font-extralight text-balance'>
					{!session && `(sign in to save your tournaments' results)`}
				</p>
			</Button>
		</div>
	)
}
