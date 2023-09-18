import NavbarIteratee from '@/components/navbar-iteratee'
import ThemeProvider from '@/components/theme-provider'
import { Analytics } from '@vercel/analytics/react'
import { PropsWithChildren } from 'react'
import './globals.css'

export const metadata = {
	title: 'mktour',
	description: 'an app for organazing complex tournament brackets of all kind',
}

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider attribute="class" disableTransitionOnChange>
					{children}
					<Analytics />
				</ThemeProvider>
			</body>
		</html>
	)
}
