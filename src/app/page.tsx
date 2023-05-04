import logo from './mktour-pascal.gif'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-centerjustify-around p-12">
      <Image className='m-auto' src={logo} alt='mktour' width={200} />
    </main>
  )
}
