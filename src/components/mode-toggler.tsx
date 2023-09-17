'use client'

import { useTheme } from 'next-themes'
import { Button } from './ui/button'
import { SunMoonIcon, MoonStarIcon } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function ModeToggler() {
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return <Button variant="outline" className="aspect-square p-1"></Button>
	}
	return (
		<Button
			onClick={() => (theme === 'dark' ? setTheme('light') : setTheme('dark'))}
			variant="outline"
			className="aspect-square p-1"
		>
			{theme === 'light' ? <SunMoonIcon /> : <MoonStarIcon />}
		</Button>
	)
}