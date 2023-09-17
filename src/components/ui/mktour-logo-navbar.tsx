import localFont from 'next/font/local'

const turboPascal = localFont({ src: '../fonts/TurboPascalFont.ttf' })

export default function MktourNavbar() {
	return (
		<h1 className={`${turboPascal.className} text-xl font-bold m-auto select-none`}>
			<span>mktour_</span>
			{/* <span className="animate-logo-pulse">_</span> */}
		</h1>
	)
}