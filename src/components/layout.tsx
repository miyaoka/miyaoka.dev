import Head from 'next/head'
import Link from 'next/link'
import config from '../site.config.json'

const { title, desc } = config

export default function Layout({
  children,
  home,
}: {
  children: React.ReactNode
  home?: boolean
}) {
  const siteTitleElement = (
    <Link href="/">
      <a className="text-lg font-bold" data-prefetch>
        {title}
      </a>
    </Link>
  )
  return (
    <div className="max-w-[840px] mx-auto justify-center p-12 pt-4 tablet:px-4 rounded-2xl tablet:rounded-none bg-white">
      <Head>
        <meta name="description" key="description" content={desc} />
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
        <meta property="og:description" key="og:description" content={desc} />
        <meta property="og:title" key="og:title" content={title} />
      </Head>
      <header className="flex sticky top-0 bg-white py-4 z-10">
        {home ? <h1>{siteTitleElement}</h1> : siteTitleElement}
      </header>
      <main>{children}</main>
    </div>
  )
}
