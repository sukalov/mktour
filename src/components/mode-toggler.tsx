'use client'

import { useTheme } from 'next-themes'
import { Button } from './ui/button'
import { SunMoonIcon, MoonStarIcon } from 'lucide-react'

export function ModeToggler() {
	const { theme, setTheme } = useTheme()
	return (
		<Button
			onClick={() => (theme === 'dark' ? setTheme('light') : setTheme('dark'))}
			variant="outline"
			style={{ aspectRatio: 1, padding: '.25rem' }}
		>
			{theme === 'light' ? <SunMoonIcon /> : <MoonStarIcon />}
		</Button>
	)
}
