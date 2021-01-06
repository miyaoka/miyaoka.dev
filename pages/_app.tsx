import '../styles/global.css'
import { AppProps } from 'next/app'
import Router from 'next/router'
import * as gtag from '../lib/gtag'
import { useEffect } from 'react'

if (gtag.GA_TRACKING_ID != null) {
  Router.events.on('routeChangeComplete', (url) => gtag.pageview(url))
}

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    import('../lib/customComponents/index')
  }, [])
  return <Component {...pageProps} />
}
