import Head from 'next/head'
import Link from 'next/link'

export const siteTitle = 'miyaoka.dev'
const siteDesc = 'miyaokaの備忘録'

export default function Layout({
  children,
  home,
}: {
  children: React.ReactNode
  home?: boolean
}) {
  const siteTitleElement = (
    <Link href="/">
      <a className="text-lg font-bold">{siteTitle}</a>
    </Link>
  )
  return (
    <div className="max-w-screen-sm mx-auto justify-center px-4 sm:px-0">
      <Head>
        <meta name="description" key="description" content={siteDesc} />
        <meta name="twitter:card" key="twitter:card" content="summary" />
        <meta
          property="og:site_name"
          key="og:site_name"
          content="miyaoka.dev"
        />
        <meta
          property="og:image"
          key="og:image"
          content="https://i.imgur.com/iwfniKw.png"
        />
        <meta
          property="og:description"
          key="og:description"
          content={siteDesc}
        />
        <meta property="og:title" key="og:title" content={siteTitle} />
      </Head>
      <header className="flex sticky top-0 bg-white py-4">
        {home ? <h1>{siteTitleElement}</h1> : siteTitleElement}
      </header>
      <main>{children}</main>
    </div>
  )
}
