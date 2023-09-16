'use client'

import { useSession } from 'next-auth/react'
import { Button } from './ui/button'
import Link from 'next/link'

interface ButtonProps {
	slug: string
	variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | undefined
	text: string | undefined
}

export default function ButtonForAuthorized({ slug, text, variant }: ButtonProps) {
	const { data: session } = useSession()
	const buttonVariant = variant ?? 'default'
	return (
		<Button variant={buttonVariant} disabled={session === null}>
			<Link href={`/${slug}`}>{text}</Link>
		</Button>
	)
}
