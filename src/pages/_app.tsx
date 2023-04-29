import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import "../../public/fonts/font.css";

export default function App({Component, pageProps}: AppProps) {
	return (
		<main className="">
			<Component {...pageProps} />
		</main>
	);
}
