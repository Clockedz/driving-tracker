import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import "../../public/fonts/font.css";
import {Analytics} from "@vercel/analytics/react";

export default function App({Component, pageProps}: AppProps) {
	return (
		<main className="">
			<Component {...pageProps} />
			<Analytics />
		</main>
	);
}
