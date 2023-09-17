'use client'

import AuthButton from '@/components/auth-button'
import Mktour from '@/components/mktour-logo'
import Navbar from '@/components/navbar'
import { useSession } from 'next-auth/react'

const HomeMobile = () => {
	const { data: session, status, update } = useSession()
  const loading = status === 'loading'
  console.log(loading)

  return <AuthButton />
} 

export default HomeMobile
