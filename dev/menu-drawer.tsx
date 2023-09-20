'use client'


import { useState } from 'react'
import { Drawer } from 'vaul'
import ModeToggler from '../src/components/mode-toggler'

export function MenuSideBar() {
	const [snap, setSnap] = useState<number | string | null>(0.5)

	return (
		<Drawer.Root
			shouldScaleBackground
			snapPoints={[0.5]}
			activeSnapPoint={snap}
			setActiveSnapPoint={setSnap}
		>
			<Drawer.Trigger asChild>
				<button>Open Drawer</button>
			</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Overlay className='fixed inset-0 bg-black/40' />
				<Drawer.Content className='bg-[hsl(var(--primary))] flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0'>
					<div className='bg-[hsl(var(--background))] p-4 rounded-t-[10px] flex-1'>
						<div className='mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8' />
						<div className='max-w-md mx-auto text-center flex flex-col justify-center'>
							<Drawer.Title className='font-medium mb-4'>Menu</Drawer.Title>
							<ModeToggler />
						</div>
					</div>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	)
}
