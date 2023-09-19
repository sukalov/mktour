'use client'

import Mktour from '@/components/ui/mktour-logo'
import { useSession } from 'next-auth/react'

export default function HomeDesktop() {
	const { data: session, status, update } = useSession()
	const loading = status === 'loading'

	if (loading) return <Mktour />
	return <h1>DESKTOP</h1>
}
