'use client'

import { SessionProvider, signIn, signOut } from 'next-auth/react'
import type { Session } from 'next-auth'
import React from 'react'
import { Button } from './ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import LichessLogo from './ui/lichess-logo'

interface AuthButtonProps {
    session: Session | null
}

export default function AuthButton({session}: AuthButtonProps) {
    const logo = React.createElement(LichessLogo)

	const handleSignIn = () => {
		signIn(undefined, { callbackUrl: '/' })
	}

	const handleSignOut = () => {
		signOut({ callbackUrl: '/' })
	}

	if (!session) {
		return (
			<div>
				<Button className='flex-row gap-4 p-2' variant="outline" onClick={() => signIn('lichess')}>
					{logo} sign in with lichess
				</Button>
			</div>
		)
	}

	return (
		<div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">{session.user?.username}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-max" onClick={handleSignOut}>
                    <DropdownMenuItem className='w-full'>sign out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
		</div>
	)
}
