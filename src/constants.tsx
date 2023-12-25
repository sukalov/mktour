import { signOut } from 'next-auth/react'
import { NavbarItem } from './types/next-auth'

export const navbarItems: NavbarItem[] = [
	{
		title: 'issues',
		path: '/issues',
		type: 'redirect',
	}
]
