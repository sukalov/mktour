import NavbarWrapper from '@/components/navbar-wrapper'
import ThemeProvider from '@/components/theme-provider'
import { Analytics } from '@vercel/analytics/react'
import { PropsWithChildren } from 'react'
import './globals.css'
import { azeretMono } from './fonts'

const metadata = {
	title: 'mktour',
	description: 'an app for organazing complex tournament brackets of all kind',
}

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang='en' suppressHydrationWarning className='min-w-[320px]'>
			<meta
				name='viewport'
				content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
			/>
			<body className={azeretMono.className}>
				<ThemeProvider attribute='class' disableTransitionOnChange>
					<NavbarWrapper />
					{children}
					<Analytics />
				</ThemeProvider>
			</body>
		</html>
	)
}
