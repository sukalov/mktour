import { Button } from '@/components/ui/button'
import LichessLogo from '@/components/ui/lichess-logo'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function HomePage() {
	const { data: session, status, update } = useSession()
	const loading = status === 'loading'

	if (!loading) return (<>
		{!session ? (
				<div className='w-full mt-16 md:mt-2 h-[calc(100svh-5rem)] p-1 flex flex-col gap-7 md:gap-2'>
				<div className='text-[clamp(3rem,8svh,6rem);] md:text-[clamp(5rem,10vw,6rem);] leading-none grow font-extrabold w-full m-auto max-w-[min(28rem,95%)] md:max-w-[min(70rem,90%)] text-balance md:text-center flex flex-auto items-center'>
					<p>chess events has become simple for everyone</p>
				</div>
			<div className='flex flex-col md:flex-row justify-center items-center gap-4 md:gap-2 md:px-12 max-w- md:mx-auto'>
				<div className='px-1 w-full h-auto m-auto'>
				<Button
					className='flex flex-col flex-none gap-2 w-full h-24 min-h-24 font-bold max-w-[28rem] m-auto px-1'
					variant='outline'
					onClick={() => signIn('lichess', { redirect: false })}
				>
					<div className=' grid-flow-col'></div>
					<span className=' grid-col-3'>
						<LichessLogo size='40' />
					</span>
					<span className='font-light text-xl grid-col--9'>sign in with lichess</span>
				</Button>
				</div>
			<Link href='/new-tournament' className='w-full m-auto px-1'>
				<Button
					className='flex flex-col gap-2 w-full min-h-24 font-bold max-w-[28rem] m-auto'
					variant='default'
				>
					<h1 className=' text-2xl min-[320px]:text-3xl font-light'>make tournament</h1>
					<p className='font-extralight text-balance'>
					</p>
				</Button>
			</Link>
			</div>
			</div>
			) :
			<Link href='/new-tournament' className='w-full m-auto px-1'>
				<Button
					className='flex flex-col gap-2 w-full min-h-24 font-bold max-w-[28rem] m-auto'
					variant='default'
				>
					<h1 className=' text-2xl min-[320px]:text-3xl font-light'>make tournament</h1>
					<p className='font-extralight text-balance'>
					</p>
				</Button>
			</Link>
			}
			</>
	)
	return <></>
}
