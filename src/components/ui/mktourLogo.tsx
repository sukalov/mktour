import localFont from 'next/font/local'
import { useEffect, useState } from 'react'

const turboPascal = localFont({ src: './TurboPascalFont.ttf' })

const Mktour = () => {
	const [isSymbolVisible, setIsSymbolVisible] = useState(true)

	useEffect(() => {
		const intervalId = setInterval(() => {
			setIsSymbolVisible((prev) => !prev)
		}, 500)

		return () => {
			clearInterval(intervalId)
		}
	}, [])

	return (
		<h1 className={`${turboPascal.className} text-6xl m-auto select-none`}>
			{isSymbolVisible ? <span>mktour_</span> : <span>mktour&nbsp;</span>}
		</h1>
	)
}

export default Mktour
