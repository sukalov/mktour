'use client'

import logo from './mktour-pascal.gif'
import Image from 'next/image'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'
import { Button } from '@/components/ui/button'
import { SunMoonIcon } from 'lucide-react'

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export default function Home() {
	return (
		<ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
			<main className='flex min-h-screen flex-col items-center justify-around p-12'>
				<section style={{display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
					<Button onClick={() => console.log('clicked')} variant='outline' style={{aspectRatio: 1, padding: '.25rem'}}>
            <SunMoonIcon/>
					</Button>
				</section>
				<Image className='m-auto' src={logo} alt='mktour' width={200} />
			</main>
		</ThemeProvider>
	)
}
