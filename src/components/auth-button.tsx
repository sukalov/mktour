'use client'

import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'
import { Button } from './ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import LichessLogo from './ui/lichess-logo'

export default function AuthButton() {
    export default function AuthButton() {
      const logo = React.createElement(LichessLogo)
	const { data: session, status, update } = useSession()

	const handleSignIn = () => {
		signIn(undefined, { callbackUrl: '/' })
	}

	const handleSignOut = () => {
		signOut({ callbackUrl: '/' })
	}

	if (!session) {
		return (
			<div>
				<SessionProvider>
					<Button className='flex-row gap-4 p-2' variant="outline" onClick={() => signIn('lichess')}>
						{logo} sign in with lichess
					</Button>
				</SessionProvider>
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
        <DropdownMenuLabel className='w-max'>sign out</DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
		</div>
	)
}
