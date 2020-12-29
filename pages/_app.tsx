import '../styles/global.css'
import { AppProps } from 'next/app'
import Router from 'next/router'
import * as gtag from '../lib/gtag'
import Head from 'next/head'

if (gtag.GA_TRACKING_ID != null) {
  Router.events.on('routeChangeComplete', (url) => gtag.pageview(url))
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Audiowide&family=Noto+Sans+JP:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
