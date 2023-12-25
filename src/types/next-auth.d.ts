import NextAuth from 'next-auth'

declare module 'next-auth' {
	interface Session {
		user: {
			sub: ReactNode
			id: string
			username: string
		}
		accessToken: string
	}
}

export type NavbarItem = NavbarActionItem | NavbarRedirectItem

export type NavbarActionItem = {
	title: string
	icon?: JSX.Element
	type: 'action'
	submenu?: boolean
	action: Function
}

export type NavbarRedirectItem = {
	title: string
	path: string
	icon?: JSX.Element
	submenu?: boolean
	subMenuItems?: NavbarRedirectItem[]
	type: 'redirect'
}
