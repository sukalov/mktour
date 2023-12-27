import { turboPascal } from '@/app/fonts'

export default function Mktour() {
	return (
		<div className='h-svh flex flex-auto items-center justify-center'>
			<h1 className={`${turboPascal.className} text-6xl font-bold m-auto select-none`}>
				<span>mktour</span>
				<span className='animate-logo-pulse'>_</span>
			</h1>
		</div>
	)
}
