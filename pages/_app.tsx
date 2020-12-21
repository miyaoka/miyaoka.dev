import '../styles/global.css'
import { AppProps } from 'next/app'
import Router from 'next/router'
import * as gtag from '../lib/gtag'

if (gtag.GA_TRACKING_ID != null) {
  Router.events.on('routeChangeComplete', (url) => gtag.pageview(url))
}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
