'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User2 } from 'lucide-react'
import type { Session } from 'next-auth'
import { signIn, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import LichessLogo from './ui/lichess-logo'

export interface AuthButtonProps {
	session: Session | null
}

export default function AuthButton({ session }: AuthButtonProps) {
	const handleSignIn = () => {
		signIn(undefined, { callbackUrl: '/' })
	}

	const handleSignOut = () => {
		signOut({ callbackUrl: '/' })
	}

	if (!session) {
		return (
			<div>
				<Button className='flex-row gap-2 p-2' variant='outline' onClick={() => signIn('lichess')}>
					<LichessLogo size={20} /> sign in with lichess
				</Button>
			</div>
		)
	}

	return (
		<div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' className='select-none gap-2 p-3'>
						<User2 />
						{session.user?.username}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='w-max flex justify-end' onClick={handleSignOut}>
					<DropdownMenuItem className='w-full flex justify-center'>sign out</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
