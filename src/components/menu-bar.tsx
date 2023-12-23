'use client'

import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarShortcut,
	MenubarTrigger,
} from '@/components/ui/menubar'

import { Menu } from 'lucide-react'
import AuthButton, { AuthButtonProps } from './auth-button'
import ButtonForAuthorized from './button-for-authorized'
import { Separator } from '@/components/ui/separator'
import ModeToggler from './mode-toggler'
import { Drawer } from 'vaul'
import { useTheme } from 'next-themes'
import { useState } from 'react'

export function MenuSideBar({ session }: AuthButtonProps) {
	return (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>
					<Menu />
				</MenubarTrigger>
				<MenubarContent className='min-w-0 p-0 m-0'>
					<MenubarItem>
						<ButtonForAuthorized text='Issues' variant='ghost' slug='issues' session={session} />
						</MenubarItem>
						<MenubarItem>
					</MenubarItem>
					<Separator />
					<div className='flex justify-end p-2'>
						<ModeToggler />
					</div>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	)
}
