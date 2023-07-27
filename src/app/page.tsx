'use client'

import { ModeToggler } from '@/components/mode-toggler'
import Mktour from '@/components/ui/mktourLogo'

export default function Home() {
	return (
		<main
			className={`flex min-h-screen flex-col items-center justify-around p-12`}
		>
			<section
				style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}
			>
				<ModeToggler />
			</section>
			{/* <Image className="m-auto" src={logo} alt="mktour" width={200} /> */}
			{Mktour()}
		</main>
	)
}
