import localFont from 'next/font/local'

const turboPascal = localFont({ src: '../fonts/TurboPascalFont.ttf' })

export default function MktourNavbar() {
	return (
		<h1 className={`${turboPascal.className} text-xl font-bold m-auto select-none`}>
			<span className='group'>mktour<span className="group-hover:animate-logo-pulse">_</span></span>
		</h1>
	)
}
