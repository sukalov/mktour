import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarShortcut,
	MenubarTrigger,
} from '@/components/ui/menubar'

import { Menu } from 'lucide-react'
import { AuthButtonProps } from './auth-button'
import ButtonForAuthorized from './button-for-authorized'
import { Separator } from '@/components/ui/separator'
import ModeToggler from './mode-toggler'

export function MenuSideBar({ session }: AuthButtonProps) {
	return (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>
					<Menu />
				</MenubarTrigger>
				<MenubarContent className='min-w-0'>
					<MenubarItem>
						<ButtonForAuthorized text='Issues' variant='ghost' slug='issues' session={session} />
						<MenubarShortcut>SLAY</MenubarShortcut>
					</MenubarItem>
					<Separator />
					<MenubarItem className='justify-end'>
						<ModeToggler />
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	)
}
