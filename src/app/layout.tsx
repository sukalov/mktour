import ThemeProvider from '@/components/theme-provider'
import { Analytics } from '@vercel/analytics/react'
import { PropsWithChildren, Suspense } from 'react'
import './globals.css'
import Navbar from '@/components/navbar'
import NavbarIteratee from '@/components/navbar-iteratee'
import Loading from './loading'

export const metadata = {
	title: 'mktour',
	description: 'an app for organazing complex tournament brackets of all kind',
}

const RootLayout = ({ children }: PropsWithChildren) => {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider attribute="class" disableTransitionOnChange>
          <Suspense fallback={ <Loading /> } >
          <NavbarIteratee />
					{children}
          </Suspense>
					<Analytics />
				</ThemeProvider>
			</body>
		</html>
	)
}

export default RootLayout
