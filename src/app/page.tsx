import ModeToggler from '@/components/mode-toggler'
import Mktour from '@/components/mktour-logo'

const Home = () => {
	return (
		<main className={`flex min-h-screen flex-col items-center justify-around p-12`}>
			<section style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
				<ModeToggler />
			</section>
			<Mktour />
		</main>
	)
}

export default Home