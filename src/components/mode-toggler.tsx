'use client'

import { useTheme } from 'next-themes'
import { Button } from './ui/button'
import { SunMoonIcon, MoonStarIcon } from 'lucide-react'
import { useState, useEffect } from 'react'

type ModeTogglerProps = {
	variant: 'desktop' | 'mobile'
}

export default function ModeToggler({ variant }: ModeTogglerProps) {
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	const toggleTheme = () => {
		setTheme(theme === 'light' ? 'dark' : 'light')
	}

	if (!mounted) {
		return <Button variant='outline' className='aspect-square p-2'></Button>
	}
	return (
		<>
			{variant === 'desktop' ? (
				<Button variant='ghost' className='aspect-square p-2' onClick={() => toggleTheme()}>
					{theme === 'light' ? <SunMoonIcon /> : <MoonStarIcon />}
				</Button>
			) : (
				<button onClick={() => toggleTheme()}>
					{theme === 'light' ? <SunMoonIcon /> : <MoonStarIcon />}
				</button>
			)}
		</>
	)
}
