import { turboPascal } from "@/app/fonts"

export default function Mktour() {
	return (
		<h1 className={`${turboPascal.className} text-6xl font-bold m-auto select-none`}>
			<span>mktour</span>
			<span className='animate-logo-pulse'>_</span>
		</h1>
	)
}
