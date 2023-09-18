'use client'

import AuthButton from '@/components/auth-button'
import Mktour from '@/components/ui/mktour-logo'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function HomeMobile() {
	const { data: session, status, update } = useSession()
	const loading = status === 'loading'

	if (loading) return <Mktour />
	return <></>
}
