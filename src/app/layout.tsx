import ThemeProvider from '@/components/theme-provider'
import { PropsWithChildren } from 'react'
import './globals.css'

export const metadata = {
	title: 'mktour',
	description: 'an app for organazing complex tournament brackets of all kind',
}

const RootLayout = ({ children }: PropsWithChildren) => {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider attribute="class" disableTransitionOnChange>
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}

export default RootLayout