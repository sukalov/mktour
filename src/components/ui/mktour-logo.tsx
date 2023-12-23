import localFont from 'next/font/local'

const turboPascal = localFont({ src: '../fonts/TurboPascalFont.ttf' })

export default function Mktour() {
	return (
		<h1 className={`${turboPascal.className} text-6xl font-bold m-auto select-none`}>
			<span>mktour</span>
			<span className='animate-logo-pulse'>_</span>
		</h1>
	)
}
