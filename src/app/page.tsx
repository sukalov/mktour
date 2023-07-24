'use client'

import logo from './mktour-pascal.gif'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-12">
      <Button onClick={ () => console.log('clicked') } variant='outline'>Button</Button>
      <Image className='m-auto' src={logo} alt='mktour' width={200} />
    </main>
  )
}
