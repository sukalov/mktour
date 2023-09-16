import localFont from 'next/font/local'
// import { useEffect, useState } from 'react'

const turboPascal = localFont({ src: './fonts/TurboPascalFont.ttf' })

const Mktour = () => {
	return (
		<h1 className={`${turboPascal.className} text-6xl font-bold m-auto select-none`}>
			<span>mktour</span>
			<span className="animate-logo-pulse">_</span>
		</h1>
	)
}

export default Mktour
